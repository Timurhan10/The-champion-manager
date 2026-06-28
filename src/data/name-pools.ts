interface NamePool {
  firstNames: string[];
  lastNames: string[];
}

const pools: Record<string, NamePool> = {
  turkic: {
    firstNames: ['Arda','Berk','Can','Deniz','Emre','Furkan','Gökhan','Hakan','İlker','Kaan','Mehmet','Nuri','Oğuz','Ömer','Serkan','Tarık','Uğur','Volkan','Yusuf','Burak','Alperen','Batuhan','Cenk','Doruk','Enes','Ferdi','Halil','Kerem','Mert','Onur','Salih','Taha','Umut','Yiğit','Barış','Cengiz','Efe','Mustafa','Recep','Ali'],
    lastNames: ['Yılmaz','Kaya','Demir','Şahin','Çelik','Öztürk','Aydın','Özdemir','Arslan','Doğan','Kılıç','Aslan','Çetin','Koç','Kurt','Özkan','Şimşek','Polat','Korkmaz','Yıldırım','Erdoğan','Güneş','Aktaş','Yıldız','Aksoy','Bayrak','Kaplan','Acar','Tekin','Tunç'],
  },
  anglo: {
    firstNames: ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Daniel','Matthew','Andrew','Christopher','Jack','Harry','Oliver','George','Charlie','Jacob','Liam','Noah','Ethan','Mason','Logan','Alexander','Benjamin','Henry','Ryan','Patrick','Sean'],
    lastNames: ['Smith','Johnson','Williams','Brown','Jones','Davis','Miller','Wilson','Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Young','King','Wright','Hill','Scott','Green','Baker','Adams','Nelson','Carter','Roberts','Turner','Campbell'],
  },
  hispanic: {
    firstNames: ['Carlos','Miguel','José','Juan','Antonio','Francisco','Alejandro','Diego','Pablo','Sergio','Fernando','Luis','Raúl','Andrés','Javier','Álvaro','Marco','Rodrigo','Daniel','Iker','Gonzalo','David','Rafael','Pedro','Alberto','Emilio','Hugo','Lucas','Mateo','Nicolás'],
    lastNames: ['García','Rodríguez','Martínez','López','González','Hernández','Pérez','Sánchez','Ramírez','Torres','Flores','Rivera','Gómez','Díaz','Cruz','Morales','Reyes','Gutiérrez','Ortiz','Ramos','Vargas','Mendoza','Castillo','Jiménez','Ruiz','Romero','Álvarez','Moreno','Muñoz','Navarro'],
  },
  lusophone: {
    firstNames: ['João','Pedro','Rafael','Bruno','Diogo','André','Rui','Tiago','Hugo','Gonçalo','Miguel','Nuno','Ricardo','Fábio','Luís','Bernardo','Daniel','Filipe','Francisco','Vítor','Cristiano','Renato','Sérgio','Eduardo','Hélder','Marco','Nelson','Paulo','Simão','Cláudio'],
    lastNames: ['Silva','Santos','Ferreira','Pereira','Oliveira','Costa','Rodrigues','Martins','Sousa','Fernandes','Gonçalves','Gomes','Lopes','Marques','Almeida','Ribeiro','Pinto','Carvalho','Teixeira','Moreira','Correia','Mendes','Nunes','Vieira','Monteiro','Cardoso','Rocha','Coelho','Cruz','Matos'],
  },
  french: {
    firstNames: ['Antoine','Baptiste','Clément','Damien','Étienne','Florian','Guillaume','Hugo','Julien','Kylian','Lucas','Mathieu','Nicolas','Olivier','Pierre','Quentin','Raphaël','Sébastien','Théo','Valentin','Adrien','Benjamin','Cédric','Dylan','Emmanuel','Franck','Gaël','Hervé','Ismaël','Jérémy'],
    lastNames: ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau','Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier','Morel','Girard','André','Mercier','Dupont','Lambert','Bonnet','François','Martinez','Blanc'],
  },
  italian: {
    firstNames: ['Alessandro','Andrea','Antonio','Christian','Daniele','Emanuele','Fabio','Giacomo','Giuseppe','Lorenzo','Luca','Marco','Matteo','Nicola','Paolo','Pietro','Roberto','Salvatore','Simone','Tommaso','Vincenzo','Alberto','Claudio','Davide','Enrico','Federico','Gianluigi','Leonardo','Massimo','Riccardo'],
    lastNames: ['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti','De Luca','Mancini','Costa','Giordano','Rizzo','Lombardi','Moretti','Barbieri','Fontana','Santoro','Mariani','Rinaldi','Caruso','Ferrara','Galli','Martini','Leone'],
  },
  germanic: {
    firstNames: ['Alexander','Andreas','Benjamin','Christian','Daniel','Erik','Florian','Hans','Jonas','Kevin','Leon','Lukas','Manuel','Niklas','Oliver','Patrick','Raphael','Sebastian','Thomas','Tobias','Maximilian','Felix','Julian','Markus','Philipp','Stefan','Marcel','Jan','Kai','Tim'],
    lastNames: ['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann','Schäfer','Koch','Bauer','Richter','Klein','Wolf','Schröder','Neumann','Schwarz','Zimmermann','Braun','Krüger','Hofmann','Hartmann','Lange','Werner','Lehmann','Kaiser','Köhler','Huber'],
  },
  slavicWest: {
    firstNames: ['Adam','Jakub','Jan','Lukáš','Marek','Martin','Michal','Ondřej','Pavel','Petr','Tomáš','Vojtěch','Daniel','David','Filip','Karel','Matěj','Patrik','Robert','Stanislav','Kamil','Radim','Roman','Vladimír','Aleš','Igor','Ivan','Josef','Milan','Zdeněk'],
    lastNames: ['Novák','Svoboda','Novotný','Dvořák','Černý','Procházka','Kučera','Veselý','Horák','Němec','Pokorný','Marek','Pospíšil','Hájek','Jelínek','Král','Růžička','Beneš','Fiala','Sedláček','Doležal','Zeman','Kolář','Navrátil','Čermák','Šťastný','Kadlec','Kovář','Urban','Vlček'],
  },
  slavicSouth: {
    firstNames: ['Aleksandar','Bojan','Darko','Dejan','Dragan','Filip','Goran','Ivan','Luka','Marko','Milan','Miroslav','Nemanja','Nikola','Petar','Siniša','Stefan','Vladan','Zoran','Dušan','Branislav','Dalibor','Igor','Josip','Mario','Matej','Nenad','Predrag','Saša','Tomislav'],
    lastNames: ['Jovanović','Petrović','Nikolić','Marković','Đorđević','Stojanović','Ilić','Stanković','Pavlović','Milošević','Tomić','Kovačević','Popović','Živković','Radović','Savić','Lazić','Bogdanović','Vasić','Simić','Todorović','Ristić','Filipović','Matić','Babić','Perić','Lukić','Obradović','Rakić','Kostić'],
  },
  slavicEast: {
    firstNames: ['Aleksei','Andrei','Anton','Boris','Denis','Dmitri','Evgeni','Igor','Ivan','Kirill','Maksim','Mikhail','Nikolai','Oleg','Pavel','Roman','Sergei','Stanislav','Viktor','Vladimir','Artem','Daniil','Fedor','Grigori','Ilya','Konstantin','Leonid','Ruslan','Timur','Yuri'],
    lastNames: ['Ivanov','Smirnov','Kuznetsov','Popov','Sokolov','Lebedev','Kozlov','Novikov','Morozov','Petrov','Volkov','Solovyov','Vasiliev','Zaytsev','Pavlov','Semyonov','Golubev','Vinogradov','Bogdanov','Voronov','Fedorov','Mikhailov','Belyaev','Tarasov','Belov','Komarov','Orlov','Kiselyov','Makarov','Andreev'],
  },
  nordic: {
    firstNames: ['Anders','Björn','Christian','Emil','Erik','Frederik','Gustav','Henrik','Jakob','Karl','Lars','Magnus','Niklas','Oscar','Per','Rasmus','Simon','Sören','Tobias','Viktor','Alexander','Daniel','Filip','Johan','Kristian','Lukas','Martin','Mikkel','Petter','Thomas'],
    lastNames: ['Andersen','Eriksen','Hansen','Jensen','Johansen','Karlsen','Larsen','Nielsen','Olsen','Pedersen','Rasmussen','Sørensen','Christensen','Berg','Lindqvist','Johansson','Andersson','Pettersson','Nilsson','Lindberg','Holm','Strand','Bakke','Haugen','Dahl','Moen','Lund','Berger','Vik','Hagen'],
  },
  dutch: {
    firstNames: ['Arjen','Bas','Daan','Edwin','Frank','Gijs','Henk','Jan','Joost','Klaas','Lars','Maarten','Niels','Pieter','Rob','Sander','Tim','Wim','Bram','Cas','Dirk','Frenkie','Guus','Jaap','Kevin','Luuk','Memphis','Rick','Stefan','Virgil'],
    lastNames: ['de Jong','van Dijk','de Boer','Jansen','de Vries','van den Berg','Bakker','Visser','Smit','Meijer','de Groot','Bos','Vos','Peters','Hendriks','van Leeuwen','Dekker','Brouwer','de Wit','Dijkstra','Vermeer','Mulder','de Graaf','Willems','Hoekstra','Koster','van der Linden','Jacobs','Kuiper','Schouten'],
  },
  hungarian: {
    firstNames: ['Ádám','Balázs','Csaba','Dániel','Ferenc','Gábor','György','István','József','Krisztián','László','Máté','Norbert','Péter','Roland','Sándor','Tamás','Viktor','Zoltán','Attila','Bálint','Dávid','Gergő','Imre','János','Levente','Márk','Richárd','Szabolcs','Tibor'],
    lastNames: ['Nagy','Kovács','Tóth','Szabó','Horváth','Varga','Kiss','Molnár','Németh','Farkas','Balogh','Papp','Takács','Juhász','Lakatos','Mészáros','Oláh','Simon','Rácz','Fekete','Szilágyi','Török','Fehér','Pintér','Antal','Lukács','Sándor','Hegedűs','Kerekes','Kozma'],
  },
  greek: {
    firstNames: ['Alexandros','Anastasios','Christos','Dimitrios','Evangelos','Georgios','Ioannis','Konstantinos','Michail','Nikolaos','Panagiotis','Petros','Sotirios','Spyridon','Stefanos','Theodoros','Vasileios','Athanasios','Eleftherios','Fotios','Grigorios','Ilias','Kostas','Marios','Nikos','Pavlos','Stavros','Thanasis','Yannis','Angelos'],
    lastNames: ['Papadopoulos','Vlachos','Nikolaou','Georgiou','Dimitriou','Konstantinou','Ioannou','Karagiannis','Papageorgiou','Athanasiou','Panagiotopoulos','Makris','Alexiou','Christodoulou','Stavropoulos','Vasileiou','Theodorou','Oikonomou','Antonopoulos','Karamanlis','Georgiadis','Kyriakidis','Diamantis','Michalopoulos','Spanos','Xanthopoulos','Rizos','Tsoukalas','Giannopoulos','Papanikolaou'],
  },
  eastAsian: {
    firstNames: ['Wei','Jun','Hao','Lei','Yang','Tao','Chen','Ming','Jian','Feng','Yuki','Takeshi','Kenji','Ryo','Daichi','Hiroshi','Kazuki','Sota','Haruto','Ren','Seung','Hyun','Min','Jin','Sung','Jae','Woo','Chan','Ho','Dong'],
    lastNames: ['Wang','Li','Zhang','Liu','Chen','Yang','Huang','Zhou','Wu','Xu','Tanaka','Suzuki','Sato','Takahashi','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato','Kim','Lee','Park','Choi','Jung','Kang','Cho','Yoon','Jang','Lim'],
  },
  southAsian: {
    firstNames: ['Aarav','Advik','Arjun','Dhruv','Ishaan','Kabir','Lakshya','Manish','Naveen','Pranav','Rahul','Rohan','Sahil','Sunil','Vikram','Virat','Ajay','Deepak','Gaurav','Harish','Kunal','Nikhil','Prashant','Rajesh','Sanjay','Suresh','Tushar','Varun','Vivek','Amit'],
    lastNames: ['Sharma','Singh','Kumar','Patel','Gupta','Rao','Das','Reddy','Joshi','Verma','Nair','Mishra','Chauhan','Khan','Shah','Mehta','Pillai','Iyer','Menon','Bhat','Desai','Malhotra','Chopra','Thakur','Saxena','Kapoor','Sinha','Banerjee','Mukherjee','Ghosh'],
  },
  southeastAsian: {
    firstNames: ['Adi','Agung','Bayu','Dimas','Eko','Fajar','Galih','Hendra','Irfan','Joko','Kurniawan','Lukman','Muhamad','Nugroho','Pratama','Rizky','Surya','Wahyu','Yusuf','Ahmad','Bambang','Cahya','Dwi','Fauzi','Gunawan','Ilham','Kevin','Reza','Taufik','Zulfikar'],
    lastNames: ['Susanto','Wijaya','Setiawan','Pratama','Hidayat','Saputra','Nugroho','Santoso','Kurniawan','Permana','Suryadi','Gunawan','Wibowo','Hartono','Purnomo','Kusuma','Halim','Tan','Lim','Ng','Wong','Chan','Ahmad','Ibrahim','Hassan','Rahman','Abdullah','Ismail','Osman','Yusof'],
  },
  arabic: {
    firstNames: ['Ahmed','Ali','Omar','Mohamed','Hassan','Ibrahim','Youssef','Khalil','Nabil','Samir','Tariq','Fadi','Karim','Rami','Walid','Amr','Hossam','Mahmoud','Mostafa','Tamer','Adel','Basel','Emad','Hazem','Khaled','Marwan','Reda','Sherif','Wael','Ziad'],
    lastNames: ['El-Sayed','Hassan','Ibrahim','Ahmed','Ali','Mahmoud','Abdallah','Khalil','Osman','Salah','Farouk','Nasser','Saeed','Hamdi','Rashed','Bakr','Gamal','Hamed','Ismail','Kamel','Mostafa','Nour','Shaker','Tawfik','Youssef','Zaki','Amin','Barakat','Darwish','Ezzat'],
  },
  balticFinnic: {
    firstNames: ['Artūrs','Dāvis','Edgars','Jānis','Kārlis','Mārtiņš','Oskars','Rihards','Sandis','Vladislavs','Andrius','Domantas','Edvinas','Giedrius','Lukas','Mantas','Paulius','Rokas','Saulius','Tomas','Arvydas','Deividas','Ignas','Justinas','Karolis','Mindaugas','Nerijus','Povilas','Rytis','Žygimantas'],
    lastNames: ['Bērziņš','Kalniņš','Ozoliņš','Jansons','Liepiņš','Krūmiņš','Zeltiņš','Sproģis','Eglītis','Vītols','Kazlauskas','Jankauskas','Petrauskas','Stankevičius','Butkus','Žukauskas','Paulauskas','Kavaliauskas','Urbonas','Mačiulis','Balčiūnas','Grigas','Jonaitis','Rimkus','Sabonis','Valančiūnas','Navickas','Gudaitis','Mikutis','Daugėla'],
  },
};

export function getNamePool(region: string): NamePool {
  return pools[region] || pools.anglo;
}
