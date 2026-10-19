```php
<?php
/*
 * CrowRules Holiday Hub
 * File: index.php
 * CrowRules Entertainment
 */

$siteName = "CrowRules Holiday Hub";
$currentYear = (int) date("Y");
$christmas = new DateTimeImmutable($currentYear . "-12-25");
$today = new DateTimeImmutable("today");

if ($today > $christmas) {
    $christmas = new DateTimeImmutable(($currentYear + 1) . "-12-25");
}

$daysUntilChristmas = (int) $today->diff($christmas)->format("%a");

$navigation = [
    ["label" => "Home", "url" => "index.php"],
    ["label" => "Santa's Office", "url" => "santa.php"],
    ["label" => "Santa Tracker", "url" => "tracker.php"],
    ["label" => "North Pole", "url" => "north-pole.php"],
    ["label" => "Christmas Stories", "url" => "stories.php"],
    ["label" => "Holiday Movies", "url" => "movies.php"],
    ["label" => "Holiday Music", "url" => "music.php"],
    ["label" => "Games & Activities", "url" => "activities.php"],
    ["label" => "Holiday Countdown", "url" => "countdown.php"],
];

$features = [
    [
        "icon" => "🎅",
        "title" => "Santa's Office",
        "description" => "Meet Santa in his North Pole office. Start with a festive welcome and explore plans for AI-powered conversations with voice and text.",
        "url" => "santa.php",
        "tag" => "Featured Experience"
    ],
    [
        "icon" => "🛷",
        "title" => "Santa Tracker",
        "description" => "Follow Santa's Christmas journey with a festive tracker experience, seasonal updates, and North Pole announcements.",
        "url" => "tracker.php",
        "tag" => "North Pole Mission"
    ],
    [
        "icon" => "🏠",
        "title" => "Explore the North Pole",
        "description" => "Discover Santa's village, the toy workshop, reindeer stables, elf headquarters, and the magical world behind Christmas.",
        "url" => "north-pole.php",
        "tag" => "Explore"
    ],
    [
        "icon" => "📖",
        "title" => "Christmas Stories",
        "description" => "Explore Christmas adventures, original holiday tales, bedtime stories, and seasonal storytelling from CrowRules.",
        "url" => "stories.php",
        "tag" => "Read & Imagine"
    ],
    [
        "icon" => "🎬",
        "title" => "Holiday Movies & Specials",
        "description" => "Discover holiday entertainment, seasonal video features, original specials, and future CrowRules Christmas productions.",
        "url" => "movies.php",
        "tag" => "Watch"
    ],
    [
        "icon" => "🎵",
        "title" => "Holiday Music",
        "description" => "Celebrate with Christmas songs, holiday playlists, festive performances, and CrowRules Entertainment music features.",
        "url" => "music.php",
        "tag" => "Listen"
    ],
    [
        "icon" => "🎮",
        "title" => "Games & Activities",
        "description" => "Enjoy holiday trivia, printable activities, Christmas challenges, coloring pages, and family-friendly seasonal fun.",
        "url" => "activities.php",
        "tag" => "Play"
    ],
    [
        "icon" => "🎄",
        "title" => "Christmas Countdown",
        "description" => "See how many days remain until Christmas and get ready for the biggest holiday of the year.",
        "url" => "countdown.php",
        "tag" => "Countdown"
    ],
];

$quickLinks = [
    ["label" => "About CrowRules", "url" => "../index.php"],
    ["label" => "CrowRules Podcasting", "url" => "../podcasting/index.php"],
    ["label" => "CrowRules+", "url" => "../crowrules-plus/index.php"],
    ["label" => "Contact", "url" => "../contact.php"],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title><?= htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8') ?> | CrowRules Entertainment</title>

    <meta name="description" content="Enter the CrowRules Holiday Hub for Santa's Office, the North Pole, Christmas stories, holiday movies, music, games, activities, and festive family fun.">

    <meta name="theme-color" content="#071b17">

    <style>
        :root {
            --bg: #071b17;
            --bg-light: #0c2922;
            --panel: #10352b;
            --panel-hover: #174536;
            --gold: #f5cc78;
            --gold-light: #ffe9ad;
            --red: #bd343c;
            --green: #164d39;
            --white: #fffaf0;
            --muted: #c4d5cb;
            --border: rgba(245, 204, 120, .22);
            --radius: 20px;
            --max-width: 1240px;
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            background: var(--bg);
            color: var(--white);
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.65;
        }

        body.menu-open {
            overflow: hidden;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        button {
            font: inherit;
        }

        button, a {
            -webkit-tap-highlight-color: transparent;
        }

        a:focus-visible,
        button:focus-visible {
            outline: 3px solid var(--gold);
            outline-offset: 4px;
        }

        .container {
            width: min(var(--max-width), calc(100% - 40px));
            margin-inline: auto;
        }

        .announcement {
            background: var(--red);
            color: white;
            text-align: center;
            padding: 9px 16px;
            font-size: .88rem;
            font-weight: 700;
        }

        .announcement span {
            color: var(--gold-light);
        }

        header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(7, 27, 23, .96);
            backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border);
        }

        .header-inner {
            min-height: 82px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 25px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }

        .brand-icon {
            width: 49px;
            height: 49px;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #c53d42, #85242d);
            border: 1px solid rgba(255,255,255,.15);
            border-radius: 15px;
            font-size: 1.7rem;
        }

        .brand strong {
            display: block;
            font-size: 1.05rem;
            letter-spacing: .04em;
        }

        .brand small {
            display: block;
            color: var(--gold);
            font-size: .73rem;
            letter-spacing: .13em;
            text-transform: uppercase;
        }

        .desktop-nav {
            display: flex;
            align-items: center;
            gap: 22px;
        }

        .desktop-nav a {
            color: var(--muted);
            font-size: .89rem;
            transition: color .2s;
        }

        .desktop-nav a:hover {
            color: var(--gold);
        }

        .nav-cta,
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            min-height: 47px;
            padding: 12px 21px;
            border-radius: 999px;
            border: 1px solid transparent;
            font-weight: 700;
            cursor: pointer;
            transition: transform .2s, background .2s, border-color .2s;
        }

        .nav-cta,
        .btn-primary {
            background: var(--gold);
            color: #182319;
        }

        .nav-cta:hover,
        .btn-primary:hover {
            background: var(--gold-light);
            transform: translateY(-2px);
        }

        .btn-secondary {
            border-color: var(--border);
            background: rgba(255,255,255,.04);
            color: var(--white);
        }

        .btn-secondary:hover {
            background: var(--panel-hover);
            border-color: var(--gold);
        }

        .menu-toggle {
            display: none;
            border: 1px solid var(--border);
            background: var(--panel);
            color: var(--white);
            width: 45px;
            height: 45px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1.3rem;
        }

        .hero {
            position: relative;
            overflow: hidden;
            min-height: 620px;
            display: grid;
            align-items: center;
            background:
                radial-gradient(ellipse at 80% 28%, rgba(193, 48, 57, .25), transparent 36%),
                radial-gradient(ellipse at 18% 80%, rgba(26, 103, 70, .30), transparent 42%),
                linear-gradient(135deg, #071b17 0%, #10372b 55%, #071b17 100%);
        }

        .hero::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: .45;
            background-image:
                radial-gradient(2px 2px at 12% 20%, white 50%, transparent 100%),
                radial-gradient(2px 2px at 44% 12%, white 50%, transparent 100%),
                radial-gradient(3px 3px at 75% 19%, white 50%, transparent 100%),
                radial-gradient(2px 2px at 90% 46%, white 50%, transparent 100%),
                radial-gradient(2px 2px at 61% 76%, white 50%, transparent 100%),
                radial-gradient(3px 3px at 26% 63%, white 50%, transparent 100%),
                radial-gradient(2px 2px at 83% 88%, white 50%, transparent 100%);
        }

        .hero-grid {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 1.1fr .9fr;
            align-items: center;
            gap: 60px;
            padding-top: 80px;
            padding-bottom: 85px;
        }

        .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--gold);
            text-transform: uppercase;
            letter-spacing: .16em;
            font-size: .78rem;
            font-weight: 800;
        }

        .eyebrow::before {
            content: "";
            width: 24px;
            height: 2px;
            background: var(--gold);
        }

        h1, h2, h3, p {
            margin-top: 0;
        }

        h1 {
            font-family: Georgia, "Times New Roman", serif;
            font-size: clamp(3rem, 6.1vw, 5.6rem);
            line-height: 1.02;
            letter-spacing: -.045em;
            margin: 22px 0;
            max-width: 700px;
        }

        h1 span {
            display: block;
            color: var(--gold);
        }

        .hero-copy {
            color: var(--muted);
            font-size: 1.08rem;
            max-width: 600px;
            margin-bottom: 30px;
        }

        .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 13px;
        }

        .hero-note {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--muted);
            font-size: .84rem;
            margin-top: 27px;
        }

        .hero-note span {
            color: var(--gold);
        }

        .santa-stage {
            position: relative;
            min-height: 400px;
            display: grid;
            place-items: center;
        }

        .santa-glow {
            position: absolute;
            width: min(360px, 90%);
            aspect-ratio: 1;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(245,204,120,.22), rgba(189,52,60,.10) 48%, transparent 70%);
        }

        .santa-card {
            position: relative;
            z-index: 1;
            width: min(365px, 100%);
            padding: 28px;
            border: 1px solid rgba(245,204,120,.35);
            border-radius: 28px;
            text-align: center;
            background: linear-gradient(150deg, rgba(22,77,57,.94), rgba(7,27,23,.95));
            box-shadow: 0 25px 90px rgba(0,0,0,.3);
        }

        .santa-portrait {
            width: 168px;
            height: 168px;
            margin: 0 auto 19px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            border: 3px solid var(--gold);
            background:
                radial-gradient(circle at 50% 35%, rgba(255,255,255,.15), transparent 48%),
                linear-gradient(145deg, #a82d36, #57202a);
            font-size: 6.1rem;
            box-shadow: 0 0 45px rgba(245,204,120,.12);
        }

        .santa-card h2 {
            font-family: Georgia, serif;
            font-size: 1.8rem;
            margin-bottom: 6px;
        }

        .santa-card p {
            color: var(--muted);
            font-size: .91rem;
            margin-bottom: 20px;
        }

        .santa-card .btn {
            width: 100%;
        }

        .floating-label {
            position: absolute;
            z-index: 2;
            padding: 10px 15px;
            border: 1px solid var(--border);
            border-radius: 13px;
            background: #0c2922;
            color: var(--gold-light);
            font-size: .82rem;
            box-shadow: 0 12px 35px rgba(0,0,0,.2);
        }

        .floating-label.one {
            top: 18px;
            right: -8px;
        }

        .floating-label.two {
            bottom: 27px;
            left: -10px;
        }

        .countdown-band {
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            background: #0b241e;
        }

        .countdown-inner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 25px;
            padding-top: 23px;
            padding-bottom: 23px;
        }

        .countdown-title strong {
            display: block;
            font-family: Georgia, serif;
            font-size: 1.4rem;
        }

        .countdown-title span {
            color: var(--muted);
            font-size: .87rem;
        }

        .countdown-clock {
            display: flex;
            gap: 12px;
        }

        .countdown-unit {
            min-width: 78px;
            padding: 8px 12px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: rgba(255,255,255,.025);
            text-align: center;
        }

        .countdown-unit strong {
            display: block;
            color: var(--gold);
            font-size: 1.6rem;
            line-height: 1.25;
        }

        .countdown-unit span {
            color: var(--muted);
            font-size: .7rem;
            text-transform: uppercase;
            letter-spacing: .09em;
        }

        section {
            padding: 88px 0;
        }

        .section-heading {
            max-width: 690px;
            margin-bottom: 36px;
        }

        .section-heading h2 {
            font-family: Georgia, serif;
            font-size: clamp(2.1rem, 4vw, 3.2rem);
            line-height: 1.15;
            margin: 14px 0;
        }

        .section-heading p {
            color: var(--muted);
            margin-bottom: 0;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
        }

        .feature-card {
            position: relative;
            min-height: 285px;
            padding: 25px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            background: linear-gradient(145deg, #10352b, #0a211b);
            transition: transform .25s, border-color .25s, background .25s;
        }

        .feature-card:hover {
            transform: translateY(-5px);
            border-color: rgba(245,204,120,.65);
            background: linear-gradient(145deg, #174536, #0b261f);
        }

        .feature-icon {
            width: 53px;
            height: 53px;
            display: grid;
            place-items: center;
            border-radius: 16px;
            background: rgba(245,204,120,.1);
            border: 1px solid var(--border);
            font-size: 1.8rem;
            margin-bottom: 22px;
        }

        .feature-tag {
            color: var(--gold);
            font-size: .7rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: .1em;
            margin-bottom: 7px;
        }

        .feature-card h3 {
            font-family: Georgia, serif;
            font-size: 1.35rem;
            margin-bottom: 9px;
        }

        .feature-card p {
            color: var(--muted);
            font-size: .88rem;
            line-height: 1.65;
            margin-bottom: 20px;
        }

        .feature-link {
            margin-top: auto;
            color: var(--gold);
            font-size: .9rem;
            font-weight: 800;
        }

        .feature-link span {
            display: inline-block;
            transition: transform .2s;
        }

        .feature-card:hover .feature-link span {
            transform: translateX(5px);
        }

        .experience {
            background:
                radial-gradient(ellipse at 85% 50%, rgba(189,52,60,.16), transparent 40%),
                #0a211b;
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
        }

        .experience-grid {
            display: grid;
            grid-template-columns: .9fr 1.1fr;
            align-items: center;
            gap: 65px;
        }

        .experience-art {
            min-height: 340px;
            border-radius: 28px;
            border: 1px solid var(--border);
            background:
                radial-gradient(circle at 50% 35%, rgba(245,204,120,.18), transparent 35%),
                linear-gradient(150deg, #164d39, #091c17);
            display: grid;
            place-items: center;
            overflow: hidden;
            position: relative;
        }

        .experience-art::before,
        .experience-art::after {
            content: "✦";
            position: absolute;
            color: var(--gold);
            font-size: 2rem;
            opacity: .6;
        }

        .experience-art::before {
            top: 35px;
            left: 40px;
        }

        .experience-art::after {
            right: 45px;
            bottom: 35px;
        }

        .experience-art .big-santa {
            font-size: clamp(7rem, 16vw, 12rem);
            filter: drop-shadow(0 18px 25px rgba(0,0,0,.3));
        }

        .experience-copy h2 {
            font-family: Georgia, serif;
            font-size: clamp(2.3rem, 4vw, 3.4rem);
            line-height: 1.1;
            margin: 15px 0;
        }

        .experience-copy p {
            color: var(--muted);
        }

        .benefits {
            list-style: none;
            padding: 0;
            margin: 24px 0 29px;
            display: grid;
            gap: 12px;
        }

        .benefits li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }

        .benefits li span {
            color: var(--gold);
        }

        .notice {
            padding: 15px 17px;
            margin-top: 20px;
            border-left: 3px solid var(--gold);
            border-radius: 0 10px 10px 0;
            background: rgba(245,204,120,.07);
            color: var(--muted);
            font-size: .83rem;
        }

        .community-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .community-card {
            padding: 28px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: var(--radius);
        }

        .community-card .icon {
            font-size: 2rem;
            margin-bottom: 15px;
        }

        .community-card h3 {
            font-family: Georgia, serif;
            font-size: 1.35rem;
        }

        .community-card p {
            color: var(--muted);
            font-size: .9rem;
            margin-bottom: 0;
        }

        .final-cta {
            padding-top: 25px;
        }

        .cta-panel {
            position: relative;
            overflow: hidden;
            padding: 55px 30px;
            border-radius: 28px;
            border: 1px solid var(--border);
            text-align: center;
            background:
                radial-gradient(ellipse at 50% 0%, rgba(245,204,120,.12), transparent 55%),
                linear-gradient(135deg, #103b2c, #10281f);
        }

        .cta-panel h2 {
            font-family: Georgia, serif;
            font-size: clamp(2rem, 4vw, 3.2rem);
            margin-bottom: 12px;
        }

        .cta-panel p {
            color: var(--muted);
            max-width: 620px;
            margin: 0 auto 24px;
        }

        footer {
            padding: 42px 0 25px;
            border-top: 1px solid var(--border);
            background: #061612;
        }

        .footer-top {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            padding-bottom: 30px;
        }

        .footer-description {
            max-width: 370px;
            color: var(--muted);
            font-size: .88rem;
            margin-top: 15px;
        }

        .footer-links {
            display: flex;
            flex-wrap: wrap;
            gap: 15px 23px;
            align-content: flex-start;
        }

        .footer-links a {
            color: var(--muted);
            font-size: .87rem;
        }

        .footer-links a:hover {
            color: var(--gold);
        }

        .footer-bottom {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            padding-top: 22px;
            border-top: 1px solid rgba(255,255,255,.08);
            color: #92aa9c;
            font-size: .79rem;
        }

        .snowflake {
            position: fixed;
            top: -20px;
            z-index: 150;
            pointer-events: none;
            color: rgba(255,255,255,.7);
            animation: snowfall linear forwards;
        }

        @keyframes snowfall {
            to {
                transform: translate3d(var(--drift), 110vh, 0) rotate(360deg);
                opacity: .15;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                scroll-behavior: auto !important;
                animation-duration: .01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: .01ms !important;
            }
        }

        @media (max-width: 1050px) {
            .desktop-nav {
                gap: 13px;
            }

            .desktop-nav a {
                font-size: .81rem;
            }

            .features-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .hero-grid {
                gap: 30px;
            }
        }

        @media (max-width: 800px) {
            .header-inner {
                min-height: 72px;
            }

            .menu-toggle {
                display: grid;
                place-items: center;
            }

            .desktop-nav {
                position: fixed;
                inset: 72px 0 auto 0;
                display: none;
                max-height: calc(100dvh - 72px);
                overflow-y: auto;
                flex-direction: column;
                align-items: stretch;
                gap: 0;
                padding: 14px 22px 25px;
                background: #071b17;
                border-bottom: 1px solid var(--border);
            }

            .desktop-nav.is-open {
                display: flex;
            }

            .desktop-nav a {
                padding: 13px 5px;
                font-size: .95rem;
                border-bottom: 1px solid rgba(255,255,255,.06);
            }

            .desktop-nav .nav-cta {
                justify-content: center;
                margin-top: 13px;
                border-bottom: 0;
            }

            .hero {
                min-height: unset;
            }

            .hero-grid {
                grid-template-columns: 1fr;
                padding-top: 65px;
                padding-bottom: 55px;
            }

            .hero-copy {
                font-size: 1rem;
            }

            .santa-stage {
                min-height: 370px;
            }

            .santa-card {
                width: min(365px, 90%);
            }

            .countdown-inner {
                flex-direction: column;
                align-items: flex-start;
            }

            .countdown-clock {
                width: 100%;
            }

            .countdown-unit {
                flex: 1;
                min-width: 0;
            }

            .experience-grid {
                grid-template-columns: 1fr;
                gap: 35px;
            }

            .experience-art {
                min-height: 280px;
            }

            .community-grid {
                grid-template-columns: 1fr;
            }

            .footer-top {
                flex-direction: column;
            }
        }

        @media (max-width: 520px) {
            .container {
                width: min(100% - 28px, var(--max-width));
            }

            .brand {
                gap: 9px;
            }

            .brand-icon {
                width: 42px;
                height: 42px;
                font-size: 1.45rem;
            }

            .brand strong {
                font-size: .91rem;
            }

            .brand small {
                font-size: .63rem;
            }

            h1 {
                font-size: clamp(2.8rem, 13vw, 4rem);
            }

            .hero-actions {
                flex-direction: column;
            }

            .hero-actions .btn {
                width: 100%;
            }

            .floating-label.one {
                right: 0;
            }

            .floating-label.two {
                left: 0;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }

            .feature-card {
                min-height: 250px;
            }

            section {
                padding: 62px 0;
            }

            .countdown-clock {
                gap: 6px;
            }

            .countdown-unit {
                padding: 9px 5px;
            }

            .countdown-unit strong {
                font-size: 1.35rem;
            }

            .countdown-unit span {
                font-size: .61rem;
            }

            .footer-bottom {
                flex-direction: column;
            }

            .cta-panel {
                padding: 38px 20px;
            }
        }
    </style>
</head>

<body>

<div class="announcement">
    🎄 Welcome to the North Pole! <span>Christmas magic lives here.</span> ✨
</div>

<header>
    <div class="container header-inner">
        <a class="brand" href="index.php" aria-label="CrowRules Holiday Hub home">
            <span class="brand-icon" aria-hidden="true">🎄</span>
            <span>
                <strong>CROWRULES</strong>
                <small>Holiday Hub</small>
            </span>
        </a>

        <button
            class="menu-toggle"
            id="menuToggle"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="mainNav"
        >☰</button>

        <nav class="desktop-nav" id="mainNav" aria-label="Main navigation">
            <?php foreach ($navigation as $item): ?>
                <a href="<?= htmlspecialchars($item['url'], ENT_QUOTES, 'UTF-8') ?>">
                    <?= htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8') ?>
                </a>
            <?php endforeach; ?>

            <a class="nav-cta" href="santa.php">🎅 Meet Santa</a>
        </nav>
    </div>
</header>

<main>
    <section class="hero">
        <div class="container hero-grid">
            <div class="hero-content">
                <div class="eyebrow">Your Christmas destination</div>

                <h1>
                    Welcome to the
                    <span>Holiday Magic.</span>
                </h1>

                <p class="hero-copy">
                    Step into the CrowRules Holiday Hub, where Christmas comes
                    alive. Meet Santa, explore the North Pole, follow the
                    Christmas countdown, discover holiday entertainment, and
                    make magical memories all season long.
                </p>

                <div class="hero-actions">
                    <a href="santa.php" class="btn btn-primary">
                        🎅 Enter Santa's Office
                    </a>

                    <a href="#explore" class="btn btn-secondary">
                        Explore the Holiday Hub →
                    </a>
                </div>

                <div class="hero-note">
                    <span>✦</span>
                    <span>Powered by imagination and brought to you by CrowRules Entertainment.</span>
                </div>
            </div>

            <div class="santa-stage" aria-label="Santa's featured welcome area">
                <div class="santa-glow"></div>

                <div class="floating-label one">✨ Christmas Magic</div>
                <div class="floating-label two">🎁 The North Pole Awaits</div>

                <div class="santa-card">
                    <div class="santa-portrait" role="img" aria-label="Illustrated Santa Claus placeholder">🎅</div>

                    <h2>Santa Is Waiting!</h2>

                    <p>
                        Step into Santa's Office and discover the beginning
                        of an extraordinary Christmas experience.
                    </p>

                    <a href="santa.php" class="btn btn-primary">
                        Visit Santa's Office →
                    </a>
                </div>
            </div>
        </div>
    </section>

    <div class="countdown-band" id="countdown">
        <div class="container countdown-inner">
            <div class="countdown-title">
                <strong>🎄 The Countdown to Christmas</strong>
                <span id="countdownMessage">
                    Every day brings us closer to Christmas!
                </span>
            </div>

            <div
                class="countdown-clock"
                id="countdownClock"
                role="timer"
                aria-label="Time remaining until Christmas"
            >
                <div class="countdown-unit">
                    <strong id="days"><?= $daysUntilChristmas ?></strong>
                    <span>Days</span>
                </div>
                <div class="countdown-unit">
                    <strong id="hours">00</strong>
                    <span>Hours</span>
                </div>
                <div class="countdown-unit">
                    <strong id="minutes">00</strong>
                    <span>Minutes</span>
                </div>
                <div class="countdown-unit">
                    <strong id="seconds">00</strong>
                    <span>Seconds</span>
                </div>
            </div>
        </div>
    </div>

    <section id="explore">
        <div class="container">
            <div class="section-heading">
                <div class="eyebrow">Explore the magic</div>
                <h2>Your All-in-One Christmas Destination</h2>
                <p>
                    From Santa's office to the toy workshop, from Christmas
                    stories to holiday movies, there's something for everyone
                    in the CrowRules Holiday Hub.
                </p>
            </div>

            <div class="features-grid">
                <?php foreach ($features as $feature): ?>
                    <a
                        class="feature-card"
                        href="<?= htmlspecialchars($feature['url'], ENT_QUOTES, 'UTF-8') ?>"
                    >
                        <div class="feature-icon" aria-hidden="true">
                            <?= htmlspecialchars($feature['icon'], ENT_QUOTES, 'UTF-8') ?>
                        </div>

                        <div class="feature-tag">
                            <?= htmlspecialchars($feature['tag'], ENT_QUOTES, 'UTF-8') ?>
                        </div>

                        <h3>
                            <?= htmlspecialchars($feature['title'], ENT_QUOTES, 'UTF-8') ?>
                        </h3>

                        <p>
                            <?= htmlspecialchars($feature['description'], ENT_QUOTES, 'UTF-8') ?>
                        </p>

                        <span class="feature-link">
                            Explore now <span aria-hidden="true">→</span>
                        </span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="experience" id="santa-experience">
        <div class="container experience-grid">
            <div class="experience-art">
                <div class="big-santa" aria-hidden="true">🎅</div>
            </div>

            <div class="experience-copy">
                <div class="eyebrow">A special North Pole experience</div>

                <h2>Meet Santa in His Very Own Office</h2>

                <p>
                    Imagine sitting across from Santa in a cozy North Pole
                    office, surrounded by Christmas lights, presents, letters,
                    and the magic of the season.
                </p>

                <p>
                    CrowRules Holiday Hub is designed to grow into an
                    interactive Santa experience featuring AI-powered
                    conversations, voice input, text chat, spoken responses,
                    and synchronized character animation.
                </p>

                <ul class="benefits">
                    <li>
                        <span aria-hidden="true">✦</span>
                        <span>Explore a dedicated Santa's Office experience.</span>
                    </li>
                    <li>
                        <span aria-hidden="true">✦</span>
                        <span>Plan for both microphone conversations and text chat.</span>
                    </li>
                    <li>
                        <span aria-hidden="true">✦</span>
                        <span>Build toward a realistic, talking Santa character.</span>
                    </li>
                    <li>
                        <span aria-hidden="true">✦</span>
                        <span>Connect future holiday experiences through Supabase.</span>
                    </li>
                </ul>

                <a href="santa.php" class="btn btn-primary">
                    Discover Santa's Office →
                </a>

                <div class="notice">
                    The talking Santa, live AI conversations, voice features,
                    and synchronized lip movements require their respective
                    integrations. This homepage is the front-end foundation;
                    the emoji artwork is a placeholder, not a photorealistic
                    Santa or a live AI character.
                </div>
            </div>
        </div>
    </section>

    <section id="holiday-fun">
        <div class="container">
            <div class="section-heading">
                <div class="eyebrow">More ways to celebrate</div>
                <h2>Make This Christmas Extraordinary</h2>
                <p>
                    The Holiday Hub can become a home for seasonal entertainment,
                    interactive adventures, and memorable experiences for the
                    entire family.
                </p>
            </div>

            <div class="community-grid">
                <article class="community-card">
                    <div class="icon" aria-hidden="true">🎁</div>
                    <h3>Family Holiday Fun</h3>
                    <p>
                        Create Christmas traditions with games, trivia,
                        printable activities, and seasonal challenges.
                    </p>
                </article>

                <article class="community-card">
                    <div class="icon" aria-hidden="true">🎥</div>
                    <h3>CrowRules Holiday Entertainment</h3>
                    <p>
                        Bring together holiday videos, original productions,
                        music, podcasts, and Christmas specials from across
                        the CrowRules Entertainment universe.
                    </p>
                </article>

                <article class="community-card">
                    <div class="icon" aria-hidden="true">🌟</div>
                    <h3>A Growing North Pole</h3>
                    <p>
                        Expand with elf profiles, reindeer stories, workshop
                        tours, seasonal events, community submissions, and
                        new interactive experiences.
                    </p>
                </article>
            </div>
        </div>
    </section>

    <section class="final-cta">
        <div class="container">
            <div class="cta-panel">
                <div class="eyebrow">Your adventure begins here</div>

                <h2>Christmas Magic Is Calling!</h2>

                <p>
                    Explore the North Pole, discover the magic of the season,
                    and make CrowRules Holiday Hub part of your Christmas
                    celebration.
                </p>

                <a href="santa.php" class="btn btn-primary">
                    🎅 Enter Santa's Office
                </a>

                <a href="tracker.php" class="btn btn-secondary">
                    🛷 Visit Santa Tracker
                </a>
            </div>
        </div>
    </section>
</main>

<footer>
    <div class="container">
        <div class="footer-top">
            <div>
                <a class="brand" href="index.php">
                    <span class="brand-icon" aria-hidden="true">🎄</span>
                    <span>
                        <strong>CROWRULES</strong>
                        <small>Holiday Hub</small>
                    </span>
                </a>

                <p class="footer-description">
                    Celebrating the magic of Christmas through entertainment,
                    stories, music, interactive experiences, and the spirit
                    of the North Pole. A CrowRules Entertainment destination.
                </p>
            </div>

            <nav class="footer-links" aria-label="Footer navigation">
                <?php foreach ($quickLinks as $link): ?>
                    <a href="<?= htmlspecialchars($link['url'], ENT_QUOTES, 'UTF-8') ?>">
                        <?= htmlspecialchars($link['label'], ENT_QUOTES, 'UTF-8') ?>
                    </a>
                <?php endforeach; ?>

                <a href="santa.php">Santa's Office</a>
                <a href="tracker.php">Santa Tracker</a>
                <a href="activities.php">Games & Activities</a>
                <a href="countdown.php">Christmas Countdown</a>
            </nav>
        </div>

        <div class="footer-bottom">
            <span>
                &copy; <?= $currentYear ?> CrowRules Entertainment.
                All rights reserved.
            </span>
            <span>Made for the magic of the holidays. 🎄</span>
        </div>
    </div>
</footer>

<script>
(() => {
    "use strict";

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function closeMenu() {
        mainNav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");

        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Christmas countdown uses the visitor's local clock.
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const messageEl = document.getElementById("countdownMessage");

    function getNextChristmas() {
        const now = new Date();
        let year = now.getFullYear();
        let target = new Date(year, 11, 25, 0, 0, 0);

        if (now >= target) {
            target = new Date(year + 1, 11, 25, 0, 0, 0);
        }

        return target;
    }

    let christmasTarget = getNextChristmas();
    let previousYear = new Date().getFullYear();

    function updateCountdown() {
        const now = new Date();

        if (now.getFullYear() !== previousYear) {
            previousYear = now.getFullYear();
            christmasTarget = getNextChristmas();
        }

        const remaining = Math.max(
            0,
            christmasTarget.getTime() - now.getTime()
        );

        const totalSeconds = Math.floor(remaining / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.textContent = String(days);
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");

        if (remaining === 0) {
            messageEl.textContent = "Merry Christmas! Enjoy the magic!";
        } else if (days === 0) {
            messageEl.textContent = "Christmas is almost here!";
        } else if (days === 1) {
            messageEl.textContent = "Just one more day until Christmas!";
        } else {
            messageEl.textContent =
                "Every day brings us closer to Christmas!";
        }
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);

    // Optional, lightweight decorative snowfall.
    // Disabled when the visitor prefers reduced motion.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (!reduceMotion.matches) {
        let lastSnowflake = 0;

        function createSnowflake(timestamp) {
            if (timestamp - lastSnowflake >= 550) {
                lastSnowflake = timestamp;

                const flake = document.createElement("span");
                flake.className = "snowflake";
                flake.textContent = Math.random() > 0.5 ? "❄" : "•";

                const size = 9 + Math.random() * 13;
                const duration = 7 + Math.random() * 9;
                const drift = (Math.random() * 140 - 70) + "px";

                flake.style.left = Math.random() * 100 + "vw";
                flake.style.fontSize = size + "px";
                flake.style.opacity = String(.25 + Math.random() * .5);
                flake.style.animationDuration = duration + "s";
                flake.style.setProperty("--drift", drift);

                document.body.appendChild(flake);

                window.setTimeout(() => flake.remove(), duration * 1000);
            }

            window.requestAnimationFrame(createSnowflake);
        }

        window.requestAnimationFrame(createSnowflake);
    }
})();
</script>

</body>
</html>
```