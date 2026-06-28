interface TeamNamePool {
  cities: string[];
  suffixes: string[];
}

const teamPools: Record<string, TeamNamePool> = {
  EG: { cities: ['Cairo','Alexandria','Giza','Zamalek','Ismailia','Port Said','Suez','Mansoura','Tanta','Aswan','Luxor','Damietta','Assiut','Fayoum','Beni Suef','Minya','Sohag','Qena'], suffixes: ['SC','FC','Club'] },
  ZA: { cities: ['Johannesburg','Cape Town','Durban','Pretoria','Port Elizabeth','Bloemfontein','Polokwane','Nelspruit','Rustenburg','Pietermaritzburg','East London','Kimberley','Stellenbosch','George','Upington','Soweto'], suffixes: ['FC','United','City','Stars'] },
  AU: { cities: ['Sydney','Melbourne','Brisbane','Perth','Adelaide','Newcastle','Wellington','Canberra','Gold Coast','Hobart','Darwin','Wollongong'], suffixes: ['FC','United','City','Victory'] },
  CN: { cities: ['Shanghai','Beijing','Guangzhou','Shenzhen','Chengdu','Wuhan','Tianjin','Dalian','Jinan','Changchun','Nanjing','Hangzhou','Shenyang','Chongqing','Qingdao','Kunming','Guiyang','Zhengzhou'], suffixes: ['FC','United'] },
  HK: { cities: ['Hong Kong','Kowloon','Tsuen Wan','Sha Tin','Tuen Mun','Tai Po','Yuen Long','Sai Kung','Wan Chai','Central'], suffixes: ['FC','Rangers','Athletic'] },
  IN: { cities: ['Mumbai','Delhi','Kolkata','Bangalore','Chennai','Hyderabad','Pune','Goa','Jamshedpur','Kochi','Guwahati','Lucknow'], suffixes: ['FC','City','United','Blasters'] },
  ID: { cities: ['Jakarta','Surabaya','Bandung','Semarang','Medan','Makassar','Palembang','Yogyakarta','Malang','Balikpapan','Solo','Denpasar','Tangerang','Bogor','Bekasi','Depok','Manado','Padang'], suffixes: ['FC','United','Putra'] },
  JP: { cities: ['Tokyo','Osaka','Yokohama','Nagoya','Sapporo','Kobe','Kawasaki','Hiroshima','Sendai','Fukuoka','Niigata','Kashima','Shimizu','Urawa','Tosu','Kashiwa','Oita','Shonan'], suffixes: ['FC','Antlers','Grampus','Marinos'] },
  MY: { cities: ['Kuala Lumpur','Johor Bahru','Penang','Ipoh','Kuching','Kota Kinabalu','Selangor','Perak','Melaka','Terengganu','Kelantan','Pahang','Kedah','Sabah'], suffixes: ['FC','United','FA'] },
  SG: { cities: ['Singapore','Tampines','Geylang','Hougang','Woodlands','Tanjong Pagar','Balestier','Albirex'], suffixes: ['FC','United','Rovers'] },
  KR: { cities: ['Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju','Ulsan','Suwon','Jeonbuk','Jeju','Seongnam','Pohang'], suffixes: ['FC','United','Hyundai'] },
  AE: { cities: ['Dubai','Abu Dhabi','Sharjah','Al Ain','Ajman','Ras Al Khaimah','Fujairah','Al Wasl','Bani Yas','Hatta','Kalba','Dibba','Khor Fakkan','Emirates'], suffixes: ['FC','Club','SC'] },
  AT: { cities: ['Wien','Salzburg','Graz','Linz','Innsbruck','Klagenfurt','Villach','Wels','Wolfsberg','Mattersburg','Altach','Ried'], suffixes: ['FC','SK','SV','Austria'] },
  BY: { cities: ['Minsk','Gomel','Mogilev','Vitebsk','Grodno','Brest','Bobruisk','Baranovichi','Pinsk','Orsha','Soligorsk','Novopolotsk','Lida','Mozyr','Slutsk','Zhodino'], suffixes: ['FK','Dinamo','FC'] },
  BE: { cities: ['Bruxelles','Antwerpen','Gent','Charleroi','Liège','Brugge','Leuven','Mechelen','Kortrijk','Genk','Oostende','Sint-Truiden','Waregem','Mouscron','Eupen','Lokeren','Westerlo','Beerschot'], suffixes: ['FC','KV','KRC','Club'] },
  BG: { cities: ['Sofia','Plovdiv','Varna','Burgas','Stara Zagora','Pleven','Sliven','Dobrich','Shumen','Razgrad','Blagoevgrad','Lovech','Veliko Tarnovo','Montana','Botev','Ludogorets'], suffixes: ['FC','PFC','CSKA'] },
  HR: { cities: ['Zagreb','Split','Rijeka','Osijek','Zadar','Slavonski Brod','Pula','Varaždin','Šibenik','Dubrovnik'], suffixes: ['NK','HNK','FC'] },
  CZ: { cities: ['Praha','Brno','Ostrava','Plzeň','Liberec','Olomouc','Zlín','České Budějovice','Hradec Králové','Pardubice','Karviná','Slovácko','Teplice','Jablonec','Bohemians','Příbram'], suffixes: ['FK','SK','FC','Slavia','Sparta'] },
  DK: { cities: ['København','Aarhus','Odense','Aalborg','Esbjerg','Randers','Horsens','Silkeborg','Viborg','Brøndby','Nordsjælland','Lyngby'], suffixes: ['FC','BK','IF','AGF'] },
  EN: { cities: ['London','Manchester','Liverpool','Birmingham','Leeds','Sheffield','Newcastle','Bristol','Nottingham','Leicester','Southampton','Brighton','Wolverhampton','Norwich','Sunderland','Middlesbrough','Stoke','Derby','Reading','Luton','Coventry','Swansea','Hull','Ipswich','Burnley','Blackburn','Bolton','Wigan','Charlton','Plymouth','Portsmouth','Oxford','Peterborough','Barnsley','Rotherham','Millwall','Preston','Cardiff','Watford','Huddersfield','Blackpool','Fleetwood','Burton','Crewe','Shrewsbury','Wycombe','Cheltenham','Carlisle','Harrogate','Doncaster','Bradford','Mansfield','Colchester','Morecambe','Newport','Crawley','Swindon','Stockport','Accrington','Barrow','Gillingham','Grimsby','Salford','Wrexham','Stevenage','Tranmere','Sutton','Hartlepool','Rochdale','AFC Wimbledon','Northampton','Exeter','Lincoln','Cambridge','MK Dons','Walsall','Forest Green','Leyton Orient','Port Vale'], suffixes: ['FC','United','City','Town','Rovers','Athletic','Albion','Wanderers','Wednesday'] },
  FI: { cities: ['Helsinki','Tampere','Turku','Oulu','Jyväskylä','Lahti','Kuopio','Pori','Kouvola','Rovaniemi','Vaasa','Seinäjoki'], suffixes: ['FC','JK','United'] },
  FR: { cities: ['Paris','Lyon','Marseille','Lille','Bordeaux','Nantes','Nice','Strasbourg','Toulouse','Montpellier','Rennes','Saint-Étienne','Lens','Reims','Brest','Angers','Metz','Monaco','Auxerre','Clermont','Troyes','Caen','Guingamp','Lorient','Ajaccio','Amiens','Dijon','Grenoble','Le Havre','Valenciennes','Bastia','Châteauroux','Laval','Niort','Pau','Rodez','Sochaux','Quevilly'], suffixes: ['FC','Olympique','AS','SC','Racing','Stade'] },
  DE: { cities: ['Berlin','München','Hamburg','Frankfurt','Dortmund','Stuttgart','Düsseldorf','Köln','Leipzig','Bremen','Hannover','Nürnberg','Augsburg','Freiburg','Hoffenheim','Wolfsburg','Leverkusen','Mönchengladbach'], suffixes: ['FC','SV','VfB','TSG','Borussia','Eintracht','Hertha','Werder','Union'] },
  GI: { cities: ['Gibraltar','Europa','St Joseph','Glacis','Lions','Lynx','Mons Calpe','Bruno Magpies'], suffixes: ['FC','United'] },
  GR: { cities: ['Athina','Thessaloniki','Piraeus','Volos','Larissa','Ioannina','Patras','Heraklion','Giannina','Tripoli','Lamia','Xanthi','Kavala','Asteras'], suffixes: ['FC','AEK','PAOK','Olympiacos','Aris'] },
  HU: { cities: ['Budapest','Debrecen','Szeged','Miskolc','Pécs','Győr','Nyíregyháza','Kecskemét','Székesfehérvár','Szombathely','Diósgyőr','Paks'], suffixes: ['FC','Ferencváros','Honvéd','Újpest','Vasas'] },
  IS: { cities: ['Reykjavik','Akureyri','Kópavogur','Hafnarfjörður','Akranes','Vestmannaeyjar','Selfoss','Breiðablik','Fylkir','Keflavík','Grindavík','Þróttur'], suffixes: ['FC','IF','KR','ÍA'] },
  IE: { cities: ['Dublin','Cork','Galway','Limerick','Waterford','Dundalk','Sligo','Drogheda','Derry','Athlone'], suffixes: ['FC','Rovers','United','City','Wanderers'] },
  IL: { cities: ['Tel Aviv','Haifa','Jerusalem','Beer Sheva','Netanya','Petah Tikva','Rishon LeZion','Ashdod','Herzliya','Ramat Gan','Ramat HaSharon','Kiryat Shmona','Bnei Yehuda','Sakhnin'], suffixes: ['FC','Maccabi','Hapoel','Beitar'] },
  IT: { cities: ['Milano','Roma','Napoli','Torino','Firenze','Genova','Bologna','Verona','Venezia','Palermo','Cagliari','Parma','Bergamo','Udine','Lecce','Empoli','Sassuolo','Salerno','Frosinone','Monza','Brescia','Bari','Modena','Pisa','Catanzaro','Reggina','Perugia','Ascoli','Ternana','Spezia','Cosenza','Sampdoria','Crotone','Cittadella','Avellino','Cesena','Padova','Siena','Vicenza','Novara'], suffixes: ['FC','AC','AS','SS','US','Inter','Juventus','Lazio'] },
  LV: { cities: ['Riga','Daugavpils','Liepāja','Jelgava','Jūrmala','Ventspils','Rēzekne','Valmiera','Ogre','Tukums'], suffixes: ['FK','FC'] },
  LT: { cities: ['Vilnius','Kaunas','Klaipėda','Šiauliai','Panevėžys','Alytus','Marijampolė','Utena','Jonava','Telšiai'], suffixes: ['FK','FC'] },
  NIR: { cities: ['Belfast','Derry','Lisburn','Newry','Bangor','Craigavon','Ballymena','Larne','Coleraine','Glentoran','Carrick','Dungannon'], suffixes: ['FC','United','City','Rangers'] },
  NL: { cities: ['Amsterdam','Rotterdam','Den Haag','Eindhoven','Utrecht','Groningen','Heerenveen','Alkmaar','Arnhem','Enschede','Tilburg','Breda','Deventer','Zwolle','Venlo','Sittard','Emmen','Waalwijk'], suffixes: ['FC','Ajax','PSV','Feyenoord','Vitesse','SC','Willem II'] },
  NO: { cities: ['Oslo','Bergen','Trondheim','Stavanger','Fredrikstad','Kristiansand','Tromsø','Drammen','Sarpsborg','Haugesund','Molde','Bodø','Ålesund','Lillestrøm','Sandefjord','Strømsgodset'], suffixes: ['FK','IF','BK','IL'] },
  PL: { cities: ['Warszawa','Kraków','Łódź','Wrocław','Poznań','Gdańsk','Szczecin','Lublin','Katowice','Białystok','Gdynia','Częstochowa','Radom','Kielce','Zabrze','Gliwice','Piast','Zagłębie'], suffixes: ['FK','KS','GKS','Legia','Wisła','Lech'] },
  PT: { cities: ['Lisboa','Porto','Braga','Guimarães','Coimbra','Funchal','Setúbal','Faro','Leiria','Viseu','Aveiro','Évora','Beja','Vila Real','Bragança','Castelo Branco','Santarém','Portimonense','Tondela','Famalicão','Arouca','Estoril','Belenenses','Moreirense','Gil Vicente','Rio Ave','Paços Ferreira','Nacional'], suffixes: ['FC','SC','SL','Benfica','Sporting','Boavista','Vitória'] },
  RO: { cities: ['București','Cluj-Napoca','Timișoara','Iași','Constanța','Craiova','Brașov','Galați','Ploiești','Oradea','Pitești','Arad','Sibiu','Botoșani','Mediaș','Voluntari'], suffixes: ['FC','CFR','Dinamo','Steaua','Rapid'] },
  RU: { cities: ['Moskva','Sankt-Peterburg','Kazan','Krasnodar','Rostov','Samara','Ekaterinburg','Nizhni Novgorod','Tula','Ufa','Orenburg','Khimki','Sochi','Grozny','Saransk','Perm'], suffixes: ['FK','Dinamo','Spartak','CSKA','Lokomotiv','Zenit'] },
  SC: { cities: ['Glasgow','Edinburgh','Aberdeen','Dundee','Inverness','Motherwell','Kilmarnock','St Johnstone','Livingston','St Mirren','Ross County','Hibernian'], suffixes: ['FC','Rangers','Celtic','United','Athletic'] },
  RS: { cities: ['Beograd','Novi Sad','Niš','Subotica','Kragujevac','Čačak','Kruševac','Lučani','Ivanjica','Bačka Topola','Inđija','Železnik','Zemun','Voždovac','Radnički','Vojvodina'], suffixes: ['FK','Crvena Zvezda','Partizan','OFK'] },
  SK: { cities: ['Bratislava','Košice','Žilina','Trnava','Trenčín','Dunajská Streda','Ružomberok','Senica','Michalovce','Skalica','Podbrezová','Zlaté Moravce'], suffixes: ['FK','FC','ŠK','MFK','AS'] },
  SI: { cities: ['Ljubljana','Maribor','Celje','Kranj','Koper','Domžale','Mura','Bravo','Tabor','Gorica'], suffixes: ['NK','FC','ND'] },
  ES: { cities: ['Madrid','Barcelona','Sevilla','Valencia','Bilbao','Vigo','San Sebastián','Villarreal','Betis','Zaragoza','Valladolid','Málaga','Las Palmas','Cádiz','Girona','Osasuna','Getafe','Elche','Alavés','Rayo Vallecano','Celta','Sporting Gijón','Almería','Tenerife','Granada','Córdoba','Huesca','Albacete','Ponferradina','Burgos','Lugo','Eibar','Mirandés','Andorra','Racing Santander','Castellón','Leganés','Real Sociedad B','Oviedo','Alcorcón','Cartagena','Ibiza'], suffixes: ['FC','CF','Real','Atlético','Deportivo','CD','UD','SD','RCD'] },
  SE: { cities: ['Stockholm','Göteborg','Malmö','Uppsala','Norrköping','Helsingborg','Örebro','Kalmar','Sundsvall','Häcken','Sirius','Djurgården','Hammarby','Elfsborg','Halmstad','Varberg'], suffixes: ['FK','IF','BK','FF','AIK'] },
  CH: { cities: ['Zürich','Basel','Bern','Genève','Lausanne','Luzern','St. Gallen','Lugano','Thun','Sion','Winterthur','Servette'], suffixes: ['FC','BSC','YB'] },
  TR: { cities: ['İstanbul','Ankara','İzmir','Bursa','Adana','Antalya','Konya','Gaziantep','Trabzon','Samsun','Kayseri','Eskişehir','Denizli','Mersin','Manisa','Balıkesir','Elazığ','Giresun','Bolu'], suffixes: ['FK','SK','Spor','Gücü','BB'] },
  UA: { cities: ['Kyiv','Kharkiv','Donetsk','Dnipro','Lviv','Odesa','Zaporizhzhia','Mariupol','Mykolaiv','Luhansk','Poltava','Chernihiv','Vorskla','Zorya','Oleksandriya','Kolos'], suffixes: ['FK','Dynamo','Shakhtar','FC'] },
  WA: { cities: ['Cardiff','Swansea','Newport','Wrexham','Bangor','Caernarfon','Connah Quay','Bala','Newtown','Aberystwyth','Barry','Llanelli'], suffixes: ['FC','Town','City','United'] },
  CA: { cities: ['Toronto','Vancouver','Montreal','Calgary','Edmonton','Ottawa','Winnipeg','Halifax'], suffixes: ['FC','United','City','Cavalry'] },
  MX: { cities: ['Ciudad de México','Guadalajara','Monterrey','Puebla','Tijuana','León','Toluca','Querétaro','Santos','Pachuca','Morelia','Veracruz','Atlas','Mazatlán','Juárez','Necaxa','Cruz Azul','San Luis'], suffixes: ['FC','CF','Club','América','Chivas'] },
  US: { cities: ['New York','Los Angeles','Chicago','Houston','Dallas','Atlanta','Seattle','Miami','Philadelphia','San Francisco','Denver','Portland','Nashville','Columbus','Orlando','Charlotte','Austin','Salt Lake'], suffixes: ['FC','United','City','SC','Inter','Galaxy','Dynamo'] },
  AR: { cities: ['Buenos Aires','Córdoba','Rosario','Mendoza','La Plata','San Juan','Tucumán','Santa Fe','Salta','Mar del Plata','Lanús','Banfield','Racing','Vélez','Defensa','Huracán','Argentinos','Independiente','San Lorenzo','Tigre'], suffixes: ['FC','Club','Athletic','Racing','River','Boca'] },
  BR: { cities: ['São Paulo','Rio de Janeiro','Belo Horizonte','Salvador','Fortaleza','Curitiba','Porto Alegre','Recife','Goiânia','Brasília','Santos','Campinas','Manaus','Belém','Florianópolis','Natal','Vitória','João Pessoa','Caxias do Sul','Joinville'], suffixes: ['FC','EC','SC','SE','CR','Atlético','Grêmio','Internacional','Flamengo','Corinthians'] },
  CL: { cities: ['Santiago','Valparaíso','Concepción','Antofagasta','Temuco','Rancagua','Talca','Arica','Iquique','La Serena','Coquimbo','Copiapó','Osorno','Puerto Montt','Calama','Chillán'], suffixes: ['FC','CD','CF','Unión','Universidad','Colo-Colo'] },
  CO: { cities: ['Bogotá','Medellín','Cali','Barranquilla','Cartagena','Bucaramanga','Pereira','Santa Marta','Manizales','Cúcuta','Ibagué','Villavicencio','Pasto','Armenia','Neiva','Montería','Sincelejo','Tunja','Popayán','Rionegro'], suffixes: ['FC','CD','Atlético','Deportivo','Junior','Millonarios','Nacional'] },
  PE: { cities: ['Lima','Arequipa','Trujillo','Chiclayo','Piura','Cusco','Huancayo','Iquitos','Tacna','Pucallpa','Sullana','Ayacucho','Cajamarca','Juliaca','Chimbote','Ica','Moquegua','Cerro de Pasco'], suffixes: ['FC','Club','Sporting','Universitario','Alianza','Cienciano'] },
  UY: { cities: ['Montevideo','Salto','Paysandú','Las Piedras','Rivera','Maldonado','Tacuarembó','Melo','Artigas','Mercedes','Trinidad','Durazno','Florida','Canelones','Colonia','Rocha'], suffixes: ['FC','Club','Peñarol','Nacional','Danubio','Defensor','River Plate','Wanderers'] },
};

const COLOR_PAIRS: [string, string][] = [
  ['#e11d48','#ffffff'],['#2563eb','#ffffff'],['#16a34a','#ffffff'],['#f59e0b','#1e3a5f'],
  ['#7c3aed','#ffffff'],['#dc2626','#000000'],['#0891b2','#ffffff'],['#ea580c','#000000'],
  ['#4f46e5','#ffffff'],['#059669','#000000'],['#be123c','#f1f1f1'],['#1d4ed8','#fbbf24'],
  ['#15803d','#f0f0f0'],['#9333ea','#fde047'],['#b91c1c','#ffffff'],['#0369a1','#ffffff'],
  ['#ca8a04','#1a1a1a'],['#6d28d9','#e5e5e5'],['#0d9488','#ffffff'],['#c2410c','#ffffff'],
  ['#1e40af','#e5e5e5'],['#166534','#fbbf24'],['#991b1b','#f5f5f5'],['#1e3a5f','#c9a84c'],
  ['#831843','#ffffff'],['#064e3b','#ffffff'],['#312e81','#fcd34d'],['#78350f','#fde68a'],
  ['#0c4a6e','#f0f0f0'],['#3f6212','#ffffff'],
];

export function getTeamNamePool(countryId: string): TeamNamePool {
  return teamPools[countryId] || { cities: ['City'], suffixes: ['FC'] };
}

export function getColorPair(index: number): [string, string] {
  return COLOR_PAIRS[index % COLOR_PAIRS.length];
}
