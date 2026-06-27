import { useState, useMemo } from 'react';
import { useGameStore } from '../store/game-store';
import { Position } from '../types';
import { formatMoney } from '../utils/format';
import { POSITIONS } from '../utils/constants';
import TeamEmblem from '../components/TeamEmblem';

type Tab = 'buy' | 'sell' | 'free';

const PAGE_SIZE = 50;

export default function TransfersScreen() {
  const navigate = useGameStore((s) => s.navigate);
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const leagues = useGameStore((s) => s.leagues);
  const season = useGameStore((s) => s.season);
  const playerTeamId = useGameStore((s) => s.playerTeamId);
  const freeAgentIds = useGameStore((s) => s.freeAgentIds);
  const attemptBuyPlayer = useGameStore((s) => s.attemptBuyPlayer);
  const attemptSellPlayer = useGameStore((s) => s.attemptSellPlayer);
  const sendTransferOffer = useGameStore((s) => s.sendTransferOffer);

  const [tab, setTab] = useState<Tab>('buy');
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [leagueFilter, setLeagueFilter] = useState<string>('ALL');
  const [minOVR, setMinOVR] = useState(0);
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(99);
  const [nameSearch, setNameSearch] = useState('');
  const [page, setPage] = useState(0);
  const [offerPlayerId, setOfferPlayerId] = useState<string | null>(null);
  const [offerSent, setOfferSent] = useState<Set<string>>(new Set());

  const team = playerTeamId ? teams[playerTeamId] : null;

  const leagueTeamSets = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const league of Object.values(leagues)) {
      map[league.id] = new Set(league.teamIds);
    }
    return map;
  }, [leagues]);

  const buyablePlayers = useMemo(() => {
    return Object.values(players)
      .filter((p) => {
        if (!p.teamId || p.teamId === playerTeamId) return false;
        if (posFilter !== 'ALL' && p.position !== posFilter) return false;
        if (leagueFilter !== 'ALL' && !leagueTeamSets[leagueFilter]?.has(p.teamId)) return false;
        if (p.overallRating < minOVR) return false;
        if (p.age < minAge || p.age > maxAge) return false;
        if (nameSearch && !p.name.toLowerCase().includes(nameSearch.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => b.overallRating - a.overallRating);
  }, [players, playerTeamId, posFilter, leagueFilter, minOVR, minAge, maxAge, nameSearch, leagueTeamSets]);

  const sellablePlayers = useMemo(() => {
    if (!team) return [];
    return team.playerIds.map((id) => players[id]).sort((a, b) => b.overallRating - a.overallRating);
  }, [team, players]);

  const freeAgents = useMemo(() => {
    return freeAgentIds.map((id) => players[id]).filter(Boolean).sort((a, b) => b.overallRating - a.overallRating);
  }, [freeAgentIds, players]);

  const handleBuyFree = (playerId: string) => {
    const success = attemptBuyPlayer(playerId);
    alert(success ? 'Transfer başarılı!' : 'Transfer başarısız. Bütçe yetersiz.');
  };

  const handleSell = (playerId: string) => {
    attemptSellPlayer(playerId);
  };

  const handleOffer = (playerId: string, pct: number) => {
    const p = players[playerId];
    if (!p) return;
    sendTransferOffer(playerId, Math.round(p.marketValue * pct));
    setOfferSent(prev => new Set(prev).add(playerId));
    setOfferPlayerId(null);
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
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <select
            value={posFilter}
            onChange={(e) => { setPosFilter(e.target.value as Position | 'ALL'); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm"
          >
            <option value="ALL">Tüm Mevkiler</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={leagueFilter}
            onChange={(e) => { setLeagueFilter(e.target.value); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm"
          >
            <option value="ALL">Tüm Ligler</option>
            {Object.values(leagues).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <input
            type="number"
            placeholder="Min OVR"
            value={minOVR || ''}
            onChange={(e) => { setMinOVR(Number(e.target.value) || 0); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm w-20"
          />
          <input
            type="number"
            placeholder="Min Yaş"
            value={minAge || ''}
            onChange={(e) => { setMinAge(Number(e.target.value) || 0); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm w-20"
          />
          <input
            type="number"
            placeholder="Max Yaş"
            value={maxAge === 99 ? '' : maxAge}
            onChange={(e) => { setMaxAge(Number(e.target.value) || 99); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm w-20"
          />
          <input
            type="text"
            placeholder="İsim ara..."
            value={nameSearch}
            onChange={(e) => { setNameSearch(e.target.value); setPage(0); }}
            className="bg-gray-700 text-white rounded px-2 py-1.5 text-sm w-36"
          />
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
                <th className="text-left p-3">Yaş</th>
                {tab === 'buy' && <th className="text-left p-3">Takım</th>}
                <th className="text-left p-3">Değer</th>
                {tab !== 'sell' && <th className="text-left p-3">Maaş</th>}
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((p) => {
                const pTeam = p.teamId ? teams[p.teamId] : null;
                return (
                  <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-gray-400">{p.position}</td>
                    <td className="p-3">
                      <span className={`font-bold ${p.overallRating >= 80 ? 'text-emerald-400' : p.overallRating >= 70 ? 'text-yellow-400' : 'text-gray-300'}`}>
                        {p.overallRating}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{p.age}</td>
                    {tab === 'buy' && (
                      <td className="p-3 text-gray-400">
                        <div className="flex items-center gap-1">
                          {pTeam && <TeamEmblem shortName={pTeam.shortName} primary={pTeam.colors.primary} secondary={pTeam.colors.secondary} size={14} />}
                          {pTeam?.shortName ?? '-'}
                        </div>
                      </td>
                    )}
                    <td className="p-3 text-emerald-400">{formatMoney(p.marketValue)}</td>
                    {tab !== 'sell' && <td className="p-3 text-gray-400">{formatMoney(p.wage)}</td>}
                    <td className="p-3">
                      {tab === 'buy' && (
                        offerSent.has(p.id) ? (
                          <span className="text-yellow-400 text-xs">Teklif gönderildi</span>
                        ) : offerPlayerId === p.id ? (
                          <div className="flex gap-1">
                            {[0.8, 1.0, 1.2, 1.5].map(pct => (
                              <button
                                key={pct}
                                onClick={() => handleOffer(p.id, pct)}
                                className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 rounded text-[10px] font-medium"
                              >
                                %{pct * 100}
                              </button>
                            ))}
                            <button onClick={() => setOfferPlayerId(null)} className="px-1.5 py-0.5 bg-gray-600 rounded text-[10px]">X</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setOfferPlayerId(p.id)}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Teklif
                          </button>
                        )
                      )}
                      {tab === 'sell' && (
                        <button onClick={() => handleSell(p.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                          Sat
                        </button>
                      )}
                      {tab === 'free' && (
                        <button onClick={() => handleBuyFree(p.id)} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-xs font-medium transition-colors">
                          Ücretsiz Al
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {pagedList.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-gray-500">Oyuncu bulunamadı</td></tr>
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
