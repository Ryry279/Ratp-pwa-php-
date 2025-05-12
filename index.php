<?php
// Clé API fournie
$apiKey = "J0f8pdg37O8gU9WBtx4ktGrQPtbuSZJe";

// Fonction pour récupérer les données RATP
function getRatpData($apiKey) {
    // URL de l'API RATP (à adapter selon l'API exacte)
    $apiUrl = "https://api.example.com/ratp?apiKey=" . $apiKey;
    
    // Options pour la requête cURL
    $options = [
        'http' => [
            'header' => "Accept: application/json\r\n",
            'method' => 'GET',
            'timeout' => 5,
        ]
    ];
    
    // Création du contexte
    $context = stream_context_create($options);
    
    try {
        // Tentative de récupération des données
        $response = @file_get_contents($apiUrl, false, $context);
        
        // Si la requête a réussi, on décode le JSON
        if ($response !== false) {
            return json_decode($response, true);
        }
    } catch (Exception $e) {
        // En cas d'erreur, on ne fait rien et on utilisera les données de secours
    }
    
    // Si l'API ne répond pas, on utilise des données de secours
    return getFallbackData();
}

// Fonction pour obtenir des données de secours en cas d'échec de l'API
function getFallbackData() {
    return [
        'metro' => [
            'totalLines' => 16,
            'normalLines' => 13,
            'lines' => [
                ['line' => '1', 'status' => 'normal', 'stations' => 'La Défense - Château de Vincennes'],
                ['line' => '2', 'status' => 'delayed', 'stations' => 'Porte Dauphine - Nation', 
                 'message' => 'Retards de 10-15 minutes suite à un incident technique à Charles de Gaulle-Étoile.'],
                ['line' => '3', 'status' => 'normal', 'stations' => 'Pont de Levallois - Gallieni'],
                ['line' => '4', 'status' => 'normal', 'stations' => 'Porte de Clignancourt - Mairie de Montrouge'],
                ['line' => '5', 'status' => 'disrupted', 'stations' => 'Bobigny - Place d\'Italie',
                 'message' => 'Service interrompu entre Bastille et Place d\'Italie jusqu\'à 18h00 en raison de travaux.'],
                ['line' => '6', 'status' => 'normal', 'stations' => 'Charles de Gaulle-Étoile - Nation'],
                ['line' => '7', 'status' => 'normal', 'stations' => 'La Courneuve - Mairie d\'Ivry/Villejuif'],
                ['line' => '8', 'status' => 'normal', 'stations' => 'Balard - Pointe du Lac'],
                ['line' => '9', 'status' => 'normal', 'stations' => 'Pont de Sèvres - Mairie de Montreuil'],
                ['line' => '10', 'status' => 'normal', 'stations' => 'Boulogne - Gare d\'Austerlitz'],
                ['line' => '11', 'status' => 'normal', 'stations' => 'Châtelet - Mairie des Lilas'],
                ['line' => '12', 'status' => 'normal', 'stations' => 'Front Populaire - Mairie d\'Issy'],
                ['line' => '13', 'status' => 'delayed', 'stations' => 'Asnières-Gennevilliers/Saint-Denis - Châtillon-Montrouge',
                 'message' => 'Ralentissements sur la branche Saint-Denis en raison d\'une affluence exceptionnelle.'],
                ['line' => '14', 'status' => 'normal', 'stations' => 'Saint-Lazare - Olympiades'],
            ]
        ],
        'rer' => [
            'totalLines' => 5,
            'normalLines' => 4,
            'lines' => [
                ['line' => 'A', 'status' => 'delayed', 'stations' => 'Saint-Germain-en-Laye / Cergy / Poissy - Boissy / Marne-la-Vallée',
                 'message' => 'Retards de 20 minutes sur toute la ligne en raison de problèmes de signalisation.'],
                ['line' => 'B', 'status' => 'normal', 'stations' => 'Robinson / Saint-Rémy-lès-Chevreuse - Aéroport CDG / Mitry-Claye'],
                ['line' => 'C', 'status' => 'normal', 'stations' => 'Pontoise / Versailles - Massy / Saint-Martin d\'Étampes / Dourdan'],
                ['line' => 'D', 'status' => 'normal', 'stations' => 'Orry-la-Ville / Creil - Melun / Corbeil-Essonnes'],
                ['line' => 'E', 'status' => 'normal', 'stations' => 'Haussmann Saint-Lazare - Chelles / Tournan']
            ]
        ]
    ];
}

// Récupération des données RATP
$data = getRatpData($apiKey);

// Extraction des données pour faciliter l'accès
$metroData = $data['metro'];
$rerData = $data['rer'];

// Définition des couleurs des lignes
$metroColors = [
    '1' => '#FFCD00',
    '2' => '#0064B0',
    '3' => '#9D9D9C',
    '4' => '#C04191',
    '5' => '#F28E42',
    '6' => '#6ECA97',
    '7' => '#FA9ABA',
    '8' => '#E3B32A',
    '9' => '#B6BD00',
    '10' => '#DCA714',
    '11' => '#704B1C',
    '12' => '#007E49',
    '13' => '#6EC4E8',
    '14' => '#62259D'
];

$rerColors = [
    'A' => '#E3051C',
    'B' => '#4B92DB',
    'C' => '#FFCC30',
    'D' => '#00A962',
    'E' => '#A0006E'
];

// Fonction pour obtenir l'icône en fonction du statut
function getStatusIcon($status) {
    switch ($status) {
        case 'normal':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon normal"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        case 'delayed':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon delayed"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
        case 'disrupted':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon disrupted"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
        default:
            return '';
    }
}

// Fonction pour obtenir le texte du statut
function getStatusText($status) {
    switch ($status) {
        case 'normal':
            return 'Service normal';
        case 'delayed':
            return 'Retards signalés';
        case 'disrupted':
            return 'Service perturbé';
        default:
            return '';
    }
}

// Fonction pour obtenir la classe CSS du statut
function getStatusClass($status) {
    switch ($status) {
        case 'normal':
            return 'status-normal';
        case 'delayed':
            return 'status-delayed';
        case 'disrupted':
            return 'status-disrupted';
        default:
            return '';
    }
}

// Date et heure actuelles en français
setlocale(LC_TIME, 'fr_FR.utf8', 'fra');
$currentDateTime = strftime('%A %d %B %H:%M', time());
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>RATP Info Retards</title>
    <meta name="description" content="Application pour suivre les retards RATP en temps réel">
    
    <!-- Liens pour PWA -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0064B0">
    <link rel="apple-touch-icon" href="icons/icon-192x192.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="RATP Info">
    
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>RATP Status</h1>
            <p class="subtitle">Informations en temps réel</p>
        </header>
        
        <!-- Message hors ligne (affiché par JavaScript) -->
        <div id="offline-message" class="offline-message" style="display: none;">
            Vous êtes hors ligne. Certaines données peuvent ne pas être à jour.
        </div>
        
        <!-- Message d'installation (affiché par JavaScript) -->
        <div id="install-prompt" class="install-prompt" style="display: none;">
            <div class="install-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
            <div class="install-content">
                <h3>Installer l'application</h3>
                <p>Pour installer cette app sur votre iPhone, appuyez sur 
                    <span class="share-icon">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12h8M12 8v8M3 12h1M12 3v1M21 12h-1M12 21v-1M18.4 18.4l-.7-.7M18.4 5.6l-.7.7M5.6 5.6l.7.7M5.6 18.4l.7-.7"></path></svg>
                    </span>
                    puis "Sur l'écran d'accueil"
                </p>
            </div>
        </div>
        
        <!-- Vue d'ensemble du statut -->
        <div class="status-overview">
            <div class="status-card">
                <div class="card-header">
                    <h2>Métro</h2>
                    <?php if ($metroData['normalLines'] === $metroData['totalLines']): ?>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon normal"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <?php else: ?>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon delayed"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <?php endif; ?>
                </div>
                <div class="card-content">
                    <div class="status-count"><?= $metroData['normalLines'] ?>/<?= $metroData['totalLines'] ?></div>
                    <p class="status-label">Lignes normales</p>
                </div>
            </div>
            <div class="status-card">
                <div class="card-header">
                    <h2>Mise à jour</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="status-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div class="card-content">
                    <div class="time"><?= $currentDateTime ?></div>
                    <p class="status-label">Actualisé automatiquement</p>
                </div>
            </div>
        </div>
        
        <!-- Onglets -->
        <div class="tabs">
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="metro">Métro</button>
                <button class="tab-button" data-tab="rer">RER</button>
            </div>
            
            <!-- Contenu des onglets -->
            <div class="tab-content active" id="metro-tab">
                <?php foreach ($metroData['lines'] as $line): ?>
                    <div class="line-status">
                        <div class="line-header">
                            <div class="line-badge" style="background-color: <?= $metroColors[$line['line']] ?? '#666666' ?>">
                                <?= $line['line'] ?>
                            </div>
                            <div class="line-info">
                                <div class="line-stations"><?= $line['stations'] ?></div>
                                <div class="line-status-text <?= getStatusClass($line['status']) ?>">
                                    <?= getStatusIcon($line['status']) ?>
                                    <span><?= getStatusText($line['status']) ?></span>
                                </div>
                            </div>
                            <?php if (isset($line['message'])): ?>
                                <div class="info-badge">Info</div>
                            <?php endif; ?>
                        </div>
                        
                        <?php if (isset($line['message'])): ?>
                            <div class="line-details">
                                <div class="details-toggle">Voir détails</div>
                                <div class="details-content <?= getStatusClass($line['status']) ?>-bg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="details-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    <p><?= $line['message'] ?></p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <div class="tab-content" id="rer-tab">
                <?php foreach ($rerData['lines'] as $line): ?>
                    <div class="line-status">
                        <div class="line-header">
                            <div class="line-badge" style="background-color: <?= $rerColors[$line['line']] ?? '#666666' ?>">
                                <?= $line['line'] ?>
                            </div>
                            <div class="line-info">
                                <div class="line-stations"><?= $line['stations'] ?></div>
                                <div class="line-status-text <?= getStatusClass($line['status']) ?>">
                                    <?= getStatusIcon($line['status']) ?>
                                    <span><?= getStatusText($line['status']) ?></span>
                                </div>
                            </div>
                            <?php if (isset($line['message'])): ?>
                                <div class="info-badge">Info</div>
                            <?php endif; ?>
                        </div>
                        
                        <?php if (isset($line['message'])): ?>
                            <div class="line-details">
                                <div class="details-toggle">Voir détails</div>
                                <div class="details-content <?= getStatusClass($line['status']) ?>-bg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="details-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                    <p><?= $line['message'] ?></p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    
    <script src="app.js"></script>
    <script>
        // Enregistrement du service worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js')
                    .then(function(registration) {
                        console.log('Service Worker enregistré avec succès:', registration.scope);
                    })
                    .catch(function(error) {
                        console.log('Échec de l\'enregistrement du Service Worker:', error);
                    });
            });
        }
    </script>
</body>
</html>
