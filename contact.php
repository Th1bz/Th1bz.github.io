<?php
header('Content-Type: application/json');

// Récupération et validation des champs
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$subject || !$message || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Champs invalides']);
    exit;
}

// Préparation du mail
$to = "test-nmabzh7gh@srv1.mail-tester.com"; //mail pro contact sur Plesk
$subjectMail = "Portfolio - Nouveau message : $subject";
$headers = "From: thibz.net <contact@winkelsass.fr>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = "Nom : $name\n";
$body .= "Email : $email\n";
$body .= "Sujet : $subject\n\n";
$body .= "Message :\n$message";

// Envoi
$sent = mail($to, $subjectMail, $body, $headers);

echo json_encode([
    'success' => $sent,
    'message' => $sent ? 'Message envoyé !' : 'Erreur lors de l\'envoi'
]);