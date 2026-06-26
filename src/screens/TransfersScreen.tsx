import { useState, useMemo } from 'react';
import { useGameStore } from '../store/game-store';
import { Position } from '../types';
import { formatMoney } from '../utils/format';
import { POSITIONS } from '../utils/constants';

type Tab = 'buy' | 'sell' | 'free';

const PAGE_SIZE = 50;

export default function TransfersScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const season = useGameStore((s) => s.season);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const freeAgentIds = useGameStore((s) => s.freeAgentIds);
  const attemptBuyPlayer = useGameStore((s) => s.attemptBuyPlayer);
  const attemptSellPlayer = useGameStore((s) => s.attemptSellPlayer);

  const [tab, setTab] = useState<Tab>('buy');
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [page, setPage] = useState(0);

  const team = playerTeamId ? teams[playerTeamId] : null;

  const buyablePlayers = useMemo(() => {
    const list = Object.values(players)
      .filter((p) => p.teamId && p.teamId !== playerTeamId)
      .filter((p) => posFilter === 'ALL' || p.position === posFilter)
      .sort((a, b) => b.overallRating - a.overallRating);
    return list;
  }, [players, playerTeamId, posFilter]);

  const sellablePlayers = useMemo(() => {
    if (!team) return [];
    return team.playerIds.map((id) => players[id]).sort((a, b) => b.overallRating - a.overallRating);
  }, [team, players]);

  const freeAgents = useMemo(() => {
    return freeAgentIds.map((id) => players[id]).filter(Boolean).sort((a, b) => b.overallRating - a.overallRating);
  }, [freeAgentIds, players]);

  const handleBuy = (playerId: string) => {
    const success = attemptBuyPlayer(playerId);
    alert(success ? 'Transfer başarılı!' : 'Transfer başarısız. Bütçe yetersiz veya kadro dolu.');
  };

  const handleSell = (playerId: string) => {
    attemptSellPlayer(playerId);
  };

  if (!season?.transferWindowOpen) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <button onClick={() => navigate('squad')} className="text-emerald-400 hover:text-emerald-300 mb-4">
          &larr; Geri
        </button>
        <h1 className="text-2xl font-bold mb-6">Transfer Merkezi</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 text-lg">Transfer penceresi kapalı</p>
        </div>
      </div>
    );
  }

  const currentList = tab === 'buy' ? buyablePlayers : tab === 'sell' ? sellablePlayers : freeAgents;
  const totalPages = Math.ceil(currentList.length / PAGE_SIZE);
  const pagedList = currentList.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <button onClick={() => navigate('squad')} className="text-emerald-400 hover:text-emerald-300 mb-4">
        &larr; Geri
      </button>
      <h1 className="text-2xl font-bold mb-4">Transfer Merkezi</h1>

      {team && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4 flex flex-wrap gap-6">
          <div>
            <span className="text-gray-400 text-sm">Bütçe</span>
            <p className="text-emerald-400 font-bold text-lg">{formatMoney(team.transferBudget)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Maaş Bütçesi</span>
            <p className="text-white font-bold text-lg">{formatMoney(team.wageBudget)}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Mevcut Maaşlar</span>
            <p className="text-white font-bold text-lg">{formatMoney(team.currentWageTotal)}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {([['buy', 'Satın Al'], ['sell', 'Sat'], ['free', 'Serbest Oyuncular']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setTab(key); setPage(0); }}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              tab === key ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'buy' && (
        <div className="mb-4">
          <select
            value={posFilter}
            onChange={(e) => { setPosFilter(e.target.value as Position | 'ALL'); setPage(0); }}
            className="bg-gray-700 text-white rounded px-3 py-2 text-sm"
          >
            <option value="ALL">Tüm Pozisyonlar</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="text-left p-3">Oyuncu</th>
                <th className="text-left p-3">Poz</th>
                <th className="text-left p-3">OVR</th>
                {tab === 'buy' && <th className="text-left p-3">Takım</th>}
                <th className="text-left p-3">Değer</th>
                {tab !== 'sell' && <th className="text-left p-3">Maaş</th>}
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((p) => (
                <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-gray-400">{p.position}</td>
                  <td className="p-3">
                    <span className={`font-bold ${p.overallRating >= 80 ? 'text-emerald-400' : p.overallRating >= 70 ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {p.overallRating}
                    </span>
                  </td>
                  {tab === 'buy' && <td className="p-3 text-gray-400">{p.teamId ? teams[p.teamId]?.shortName : '-'}</td>}
                  <td className="p-3 text-emerald-400">{formatMoney(p.marketValue)}</td>
                  {tab !== 'sell' && <td className="p-3 text-gray-400">{formatMoney(p.wage)}</td>}
                  <td className="p-3">
                    {tab === 'buy' && (
                      <button onClick={() => handleBuy(p.id)} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                        Satın Al
                      </button>
                    )}
                    {tab === 'sell' && (
                      <button onClick={() => handleSell(p.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                        Sat
                      </button>
                    )}
                    {tab === 'free' && (
                      <button onClick={() => handleBuy(p.id)} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                        Ücretsiz Al
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {pagedList.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Oyuncu bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40 hover:bg-gray-600 transition-colors"
          >
            &larr;
          </button>
          <span className="px-3 py-1 text-gray-400">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40 hover:bg-gray-600 transition-colors"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
