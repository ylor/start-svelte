/*
  At minimum each entry requires `"url"` & `"aliases"` properties.
  If you want it to show in the tree section it must have a `"category"` property value.

  `"url"` must be a string
  `"aliases"` must be an array,even if it's a single entry
 */

export const config = {
  sites: [
    // Search
    {
      name: "Google",
      aliases: ["google", "*"],
      url: "https://google.com",
      search: "https://google.com/search?q={}",
    },
    {
      name: "DuckDuckGo",
      aliases: ["duckduckgo", "duck", "ddg", "d"],
      url: "https://duckduckgo.com",
      search: "https://duckduckgo.com/?q={}",
    },
    // Server
    {
      category: "👨🏽‍💻 Server",

      name: "Homebridge",
      aliases: ["homebridge", "hb"],
      url: "http://docker.lan:8181",
    },
    {
      category: "👨🏽‍💻 Server",
      name: "Pi-hole",
      aliases: ["pihole", "pi", "dns"],
      url: "http://pi.hole/admin",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Plex",
      aliases: ["plex"],
      url: "http://server.local:32400/web/index.html",
      search: "http://server.local:32400/web/index.html#!/search?query={}",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Radarr",
      aliases: ["radarr", "movies", "m"],
      url: "http://server.lan:7878",
      search: "http://server.lan:7878/add/new?term={}",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Sonarr",
      aliases: ["sonarr", "tv"],
      url: "http://server.lan:8989",
      search: "http://server.lan:8989/add/new?term={}",
    },
    {
      category: "👨🏽‍💻 Server",

      name: "Transmission",
      aliases: ["transmission", "bt"],
      url: "http://server.lan:9091",
    },
    {
      category: "👨🏽‍💻 Server",
      name: "UniFi Controller",
      aliases: ["unifi"],
      url: "http://server.lan:8080",
    },
    //Work
    {
      category: "🎓 MDC",
      name: "Classroom Inventory",
      aliases: ["ci", "inv"],
      url:
        "https://apps.powerapps.com/play/7639b6b6-1edb-4d5d-bec8-832a864ee4fd?tenantId=b0626806-ceff-4393-821e-f9a3e666893b",
    },
    {
      category: "🎓 MDC",
      name: "Apple School Manager",
      aliases: ["apple school manager", "asm"],
      url: "http://school.apple.com",
    },
    {
      category: "🎓 MDC",
      name: "Duo",
      aliases: ["duo"],
      url: "http://admin.duosecurity.com",
    },
    {
      category: "🎓 MDC",
      name: "Forms",
      aliases: ["form", "forms"],
      url:
        "https://forms.office.com/Pages/ResponsePage.aspx?id=BmhisP_Ok0OCHvmj5maJOxTM7A6YzXlAmKCvVMMrgsFUMzJaTFhGOEY0STlLWkVMR1JKMU4zMThFTC4u",
    },
    {
      category: "🎓 MDC",
      name: "Fusion",
      aliases: ["fusion", "kfusion"],
      url: "http://kfusion/fusion/WebClient/",
    },
    {
      category: "🎓 MDC",
      name: "JAMF",
      aliases: ["jamf"],
      url: "https://kmacdep.kendall.mdcc.edu:8443",
    },
    {
      category: "🎓 MDC",
      name: "Kaseya",
      aliases: ["kaseya"],
      url: "https://kaseya.mdc.edu",
    },
    {
      category: "🎓 MDC",
      name: "Miami Dade College",
      aliases: ["mdc"],
      url: "http://www.mdc.edu",
    },
    {
      category: "🎓 MDC",
      name: "NTAuth",
      aliases: ["ntauth"],
      url: "http://ntauth.mdc.edu",
    },
    {
      category: "🎓 MDC",
      name: "NTAuth - Employee",
      aliases: ["emp"],
      url: "https://mdcwapi.mdc.edu:8001/ntauth_hd",
      search:
        "https://mdcwapi.mdc.edu:8001/ntauth_hd/ManageAccount?domainValue=MDCC&personnelID={}",
    },
    {
      category: "🎓 MDC",
      name: "NTAuth - Student",
      aliases: ["stu"],
      url: "https://mdcwapi.mdc.edu:8001/ntauth_hd",
      search:
        "https://mdcwapi.mdc.edu:8001/ntauth_hd/ManageAccount?domainValue=MYMDC&personnelID={}",
    },
    {
      category: "🎓 MDC",
      name: "Service Requests",
      aliases: ["kloadbal", "loadbal", "klb", "sr"],
      url: "http://kloadbal.kendall.mdcc.edu",
    },
    {
      category: "🎓 MDC",
      name: "Sharepoint",
      aliases: ["cns", "sharepoint"],
      url:
        "https://miamidadecollegeprod.sharepoint.com/teams/MDC_Kendall_CampusNetworkServices/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx",
    },
    {
      category: "🎓 MDC",
      name: "Sharepoint-old",
      aliases: ["cns-old", "sharepoint-old"],
      url:
        "https://sharepoint.mdc.edu/kendall/departments/cns/SitePages/CNS%20Department%20Policies%20and%20Procedures.aspx",
    },
    {
      category: "🎓 MDC",
      name: "Timeclock",
      aliases: ["timeclock", "tc"],
      url: "https://timeclock.mdc.edu",
    },
    // Destiny
    {
      category: "🎮 Destiny",
      name: "Braytech",
      aliases: ["braytech"],
      url: "https://braytech.org",
    },
    {
      category: "🎮 Destiny",
      name: "D2 Checklist",
      aliases: ["d2checklist", "d2c"],
      url: "https://www.d2checklist.com/3/4611686018467433733/milestones",
    },
    {
      category: "🎮 Destiny",
      name: "Destiny Item Manager",
      aliases: ["destiny item manager", "dim"],
      url: "https://app.destinyitemmanager.com",
    },
    {
      category: "🎮 Destiny",
      name: "Destiny Sets",
      aliases: ["destiny sets", "sets"],
      url: "https://destinysets.com",
    },
    {
      category: "🎮 Destiny",
      name: "Guardian.gg",
      aliases: ["guardian", "ggg"],
      url: "https://guardian.gg",
    },
    {
      category: "🎮 Destiny",
      name: "Light.gg",
      aliases: ["lightgg", "light"],
      url: "https://light.gg",
      search: "https://www.light.gg/db/search/?q={}",
    },
    {
      category: "🎮 Destiny",
      name: "Today in Destiny",
      aliases: ["todayindestiny", "tid"],
      url: "https://www.todayindestiny.com",
    },
    {
      category: "🎮 Destiny",
      name: "Xur",
      aliases: ["xur"],
      url: "https://braytech.org/xur",
    },
    // Media
    {
      category: "📼 Media",
      name: "Giant Bomb",
      aliases: ["giant bomb", "gb"],
      url: "https://www.giantbomb.com/",
      search: "https://www.giantbomb.com/search/?i=&q={}",
      favorite: true,
    },
    {
      category: "📼 Media",
      name: "Giant Bomb Infinite",
      aliases: ["giant bomb infinite", "gb8"],
      url: "https://www.giantbomb.com/infinite",
    },
    {
      category: "📼 Media",
      name: "Letterboxd",
      aliases: ["letterboxd", "lb"],
      url: "https://letterboxd.com/films/popular/this/week/size/large",
      search: "https://letterboxd.com/search/films/{}/",
    },
    {
      category: "📼 Media",
      name: "Overcast",
      aliases: ["overcast", "oc"],
      url: "https://overcast.fm/",
    },
    {
      category: "📼 Media",
      name: "Netflix",
      aliases: ["netflix", "nf"],
      url: "https://www.netflix.com",
      search: "https://www.netflix.com/search?q={}",
    },
    {
      category: "📼 Media",
      name: "Plex",
      aliases: ["plexapp", "plextv", "plexr"],
      url: "https://app.plex.tv/desktop",
      search: "https://app.plex.tv/desktop#!/search?query={}",
    },
    {
      category: "📼 Media",
      name: "Spotify",
      aliases: ["spotify"],
      url: "https://open.spotify.com",
    },
    {
      category: "📼 Media",
      name: "Twitch",
      aliases: ["twitch", "ttv", "t"],
      url: "https://twitch.tv/",
    },
    {
      category: "📼 Media",
      name: "Hasan",
      aliases: ["hasanabi", "hasan", "azan", "ajan"],
      url: "https://twitch.tv/hasanabi",
      hidden: true
    },
    {
      category: "📼 Media",
      name: "YouTube",
      aliases: ["youtube", "yt", "y"],
      url: "https://youtube.com",
      search: "https://youtube.com/results?search_query={}",
    },
    // Reddit
    {
      category: "🤖 Reddit",
      name: "/r/Battlestations",
      aliases: ["r/battlestations", "r/bs"],
      url: "https://www.reddit.com/r/battlestations",
      search:
        "https://www.reddit.com/r/battlestations/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/DestinyTheGame",
      aliases: ["r/destinythegame", "r/dtg", "dtg"],
      url: "https://www.reddit.com/r/destinythegame",
      search:
        "https://www.reddit.com/r/destinythegame/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/RaidSecrets",
      aliases: ["r/raidsecrets", "r/rs", "rs"],
      url: "https://www.reddit.com/r/raidsecrets",
      search: "https://www.reddit.com/r/raidsecrets/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/HipHopHeads",
      aliases: ["r/hiphopheads", "r/hhh", "hhh"],
      url: "https://www.reddit.com/r/hiphopheads",
      search: "https://www.reddit.com/r/hiphopheads/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/horror",
      aliases: ["r/horror"],
      url: "https://www.reddit.com/r/horror",
      search: "https://www.reddit.com/r/horror/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/MechanicalKeyboards",
      aliases: ["r/mechanicalkeyboards", "r/mk", "rmk"],
      url: "https://www.reddit.com/r/mechanicalkeyboards",
      search:
        "https://www.reddit.com/r/mechanicalkeyboards/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/MechMarket",
      aliases: ["r/mechmarket", "r/mm", "mm"],
      url: "https://www.reddit.com/r/mechmarket",
      search: "https://www.reddit.com/r/mechmarket/search?q={}&restrict_sr=1",
    },
    {
      category: "🤖 Reddit",
      name: "/r/SquaredCircle",
      aliases: ["r/squaredcircle", "r/sc"],
      url: "https://www.reddit.com/r/squaredcircle",
      search:
        "https://www.reddit.com/r/squaredcircle/search?q={}&restrict_sr=1",
    },
    // Socials
    {
      category: "💬 Socials",
      name: "Discord",
      aliases: ["discord"],
      url: "https://discordapp.com/activity",
    },
    {
      category: "💬 Socials",
      name: "Github",
      aliases: ["github", "git"],
      url: "https://github.com",
      search: "https://github.com/search?q={}",
    },
    {
      category: "💬 Socials",
      name: "Geekhack",
      aliases: ["geekhack", "gh"],
      url: "https://geekhack.org",
    },
    {
      name: "Geekhack - Interest Check",
      aliases: ["ghic", "ghi"],
      url: "https://geekhack.org/index.php?board=132.0",
    },
    {
      name: "Geekhack - Group Buys and Preorders",
      aliases: ["ghgb", "ghb"],
      url: "https://geekhack.org/index.php?board=70.0",
    },
    {
      category: "💬 Socials",
      name: "Instagram",
      aliases: ["instagram", "insta", "ig"],
      url: "https://www.instagram.com",
    },
    {
      category: "💬 Socials",
      name: "Hacker News",
      aliases: ["hacker news", "hn"],
      url: "https://news.ycombinator.com",
      search: "https://hn.algolia.com/?&query={}",
      favorite: true,
    },
    {
      category: "💬 Socials",
      name: "Reddit",
      aliases: ["reddit", "r/all"],
      url: "https://www.reddit.com/r/all",
      search: "https://www.reddit.com/search?q={}",
      hidden: true,
    },
    {
      category: "💬 Socials",
      name: "Reddit Subreddit",
      aliases: ["r"],
      url: "https://www.reddit.com/r",
      search: "https://www.reddit.com/search?q={}",
      hidden: true,
    },
    {
      category: "💬 Socials",
      name: "Reddit User",
      aliases: ["u"],
      url: "https://www.reddit.com/u",
      search: "https://www.reddit.com/u/search?q={}",
      hidden: true,
    },
    {
      category: "💬 Socials",
      name: "ResetERA",
      aliases: ["resetera", "reset", "era", "re"],
      url: "https://www.resetera.com",
      favorite: true,
    },
    {
      category: "💬 Socials",
      name: "Tildes",
      aliases: ["tildes", "tilde", "~"],
      url: "https://tildes.net",
      saerch: "https://tildes.net/search?q={}",
      favorite: true,
    },
    {
      category: "💬 Socials",
      name: "Twitter",
      aliases: ["twitter"],
      url: "https://twitter.com",
      search: "https://twitter.com/search?q={}",
    },
    {
      category: "💬 Socials",
      name: "WhatsApp",
      aliases: ["whatsapp", "wa"],
      url: "https://web.whatsapp.com",
      hidden: true,
    },
    //🛠 Utilities. Should this be its own category?
    {
      name: "1Password Generator",
      aliases: ["1pw", "pwg", "pw"],
      url: "https://1password.com/password-generator",
    },
    {
      name: "Bitwarden",
      aliases: ["bitwarden", "bw"],
      url: "https://vault.bitwarden.com",
    },
    {
      name: "Dotfiles",
      aliases: ["dot"],
      url: "https://github.com/ylor/dotfiles",
    },
    {
      name: "Emojipedia",
      aliases: ["emojipedia", "emoji"],
      url: "https://emojipedia.org/",
      search: "https://emojipedia.org/search/?q={}",
    },
    {
      name: "iCloud",
      aliases: ["icloud"],
      url: "https://www.icloud.com",
    },
    {
      name: "iCloud Mail",
      aliases: ["mail"],
      url: "https://www.icloud.com/#mail",
    },
    {
      name: "Simplenote",
      aliases: ["simplenote", "sn"],
      url: "https://app.simplenote.com",
    },
    // 🔗 Internet
    {
      name: "Audio Science Review",
      aliases: ["audiosciencereview", "asr"],
      url: "https://www.audiosciencereview.com/forum/index.php?reviews",
    },
    {
      name: "ComicVine",
      aliases: ["comicvine", "cv"],
      url: "https://comicvine.gamespot.com",
      search: "https://comicvine.gamespot.com/search/?i=volume&q={}",
    },
    {
      name: "Daring Fireball",
      aliases: ["daringfireball", "df"],
      url: "https://daringfireball.net",
    },
    {
      name: "Google Drive",
      aliases: ["googledrive", "gdrive", "drive"],
      url: "https://drive.google.com",
    },
    {
      name: "Giphy",
      aliases: ["giphy", "gif"],
      url: "https://giphy.com",
      search: "https://giphy.com/search/{}",
    },
    {
      name: "Grumpy Website",
      aliases: ["grumpywebsite", "grumpy", "gw"],
      url: "https://grumpy.website",
      favorite: true,
    },
    {
      name: "How Long to Beat",
      aliases: ["how lont to beat", "hltb"],
      url: "https://howlongtobeat.com",
      search: "https://howlongtobeat.com/?q={}",
    },
    {
      name: "Lobsters",
      aliases: ["lobsters", "lob"],
      url: "https://lobste.rs/",
      search: "https://lobste.rs/search?q={}",
      favorite: true,
    },
    {
      name: "MyAnimeList",
      aliases: ["myanimelist", "mal"],
      url: "https://myanimelist.net",
      search: "https://myanimelist.net/search/all?q={}",
    },
    {
      name: "Netlify",
      aliases: ["netlify"],
      url: "https://app.netlify.com",
    },
    {
      name: "Node Package Manager",
      aliases: ["npm"],
      url: "https://www.npmjs.com",
      search: "https://www.npmjs.com/search?q={}",
      hidden: true,
    },
    {
      name: "OneDrive",
      aliases: ["onedrive", "od"],
      url: "https://onedrive.live.com",
    },
    {
      name: "Pinboard",
      aliases: ["pinboard", "pb"],
      url: "https://pinboard.in",
      search: "https://pinboard.in/search/u:rolyreyes?query={}",
      favorite: true,
    },

    {
      name: "Wirecutter",
      aliases: ["wirecutter", "wc"],
      url: "https://thewirecutter.com",
    },

    // 🔍 Searchin'
    {
      name: "The Movie Database",
      aliases: ["tmdb"],
      url: "https://www.themoviedb.org",
      search: "https://www.themoviedb.org/search?query={}&language=en-US",
      hidden: true,
    },
    {
      name: "The TVDB",
      aliases: ["tvdb"],
      url: "https://thetvdb.com",
      search: "https://thetvdb.com/search?query={}",
      hidden: true,
    },
    {
      name: "Wikipedia",
      aliases: ["wikipedia", "wiki"],
      url: "https://www.wikipedia.org",
      search: "https://en.wikipedia.org/wiki/{}",
      hidden: true,
    },
    {
      name: "Yarn",
      aliases: ["yarn"],
      url: "https://yarnpkg.com",
      search: "https://classic.yarnpkg.com/en/packages?q={}&p=1",
      hidden: true,
    },
    // 💸 Shoppin'
    {
      name: "Amazon",
      aliases: ["amazon", "a"],
      url: "https://www.amazon.com",
      search: "https://www.amazon.com/s?k={}",
    },
    {
      name: "Best Buy",
      aliases: ["best buy", "bestbuy", "bby", "bb"],
      url: "https://www.bestbuy.com",
      search: "https://www.bestbuy.com/site/searchpage.jsp?st={}",
    },
    {
      name: "CamelCamelCamel",
      aliases: ["camelcamelcamel", "ccc"],
      url: "https://camelcamelcamel.com",
      search: "https://camelcamelcamel.com/search?sq={}",
    },
    {
      name: "Epic Game Store",
      aliases: ["epic game store", "egs"],
      url: "https://www.epicgames.com/store",
      search: "https://www.epicgames.com/store/en-US/browse?q={}",
    },
    {
      name: "Steam",
      aliases: ["steam"],
      url: "https://store.steampowered.com",
      search: "https://store.steampowered.com/search/?term={}",
    },
    // 🏴‍☠️ Sailin'
    {
      name: "1337x",
      aliases: ["1337x", "1337"],
      url: "https://www.1377x.to",
      search: "https://www.1377x.to/sort-search/{}/seeders/desc/1/",
    },
    {
      name: "IGG-GAMES",
      aliases: ["igg-games", "igggames", "igg"],
      url: "https://igg-games.com/",
      search: "https://igg-games.com/?s={}",
    },
    {
      name: "Fitgirl-Rpacks",
      aliases: ["fitgirl-repacks", "fitgirl", "fg"],
      url: "https://fitgirl-repacks.site/",
      search: "https://fitgirl-repacks.site/?s={}",
    },
    {
      name: "Nyaa",
      aliases: ["nyaa"],
      url: "https://nyaa.si",
      search: "https://nyaa.si/?f=0&c=0_0&q={}",
    },
    {
      name: "RARBG",
      aliases: ["rarbg", "rar"],
      url: "https://rarbg.to/torrents",
      search: "https://rarbg.to/torrents?search={}",
    },
    // 🗑️ Ugh
    {
      name: "/g/ - Technology",
      aliases: ["g"],
      url: "https://boards.4chan.org/g/catalog",
    },
    {
      name: "/w/ - Wallpapers",
      aliases: ["w"],
      url: "https://boards.4chan.org/w/catalog",
    },
    {
      name: "/wg/ - Wallpapers General",
      aliases: ["wg"],
      url: "https://boards.4chan.org/wg/catalog",
    },
  ],
};
