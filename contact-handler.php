<?php
/**
 * Contact Form Handler
 * Sends form submissions to saphallamsal9@gmail.com
 * 
 * IMPORTANT: This requires a PHP server with mail() function enabled
 * For static hosting, use Formspree instead (see EMAIL-SETUP.md)
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set headers for CORS (if needed)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Configuration
$to_email = 'saphallamsal9@gmail.com';
$from_email = 'noreply@safallamsal.com.np';
$from_name = 'Portfolio Contact Form';

// Get form data
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'General Inquiry';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Honeypot spam check
if (!empty($_POST['_gotcha'])) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Thank you for your message']);
    exit;
}

// Validate required fields
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format';
}

if (empty($message)) {
    $errors[] = 'Message is required';
}

// Return errors if validation fails
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Build email content
$email_subject = "Portfolio Contact: $subject";

$email_body = "New contact form submission from your portfolio:\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: " . ($phone ?: 'Not provided') . "\n";
$email_body .= "Subject: $subject\n\n";
$email_body .= "Message:\n$message\n\n";
$email_body .= "---\n";
$email_body .= "Sent from: " . $_SERVER['HTTP_HOST'] . "\n";
$email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
$email_body .= "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n";
$email_body .= "Timestamp: " . date('Y-m-d H:i:s') . "\n";

// Email headers
$headers = [];
$headers[] = "From: $from_name <$from_email>";
$headers[] = "Reply-To: $name <$email>";
$headers[] = "X-Mailer: PHP/" . phpversion();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";

// Send email
$mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    // Log successful submission (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Success - From: $email - Subject: $subject\n";
    file_put_contents('contact-log.txt', $log_entry, FILE_APPEND);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! I will get back to you soon.'
    ]);
} else {
    // Log failed submission
    $log_entry = date('Y-m-d H:i:s') . " - Failed - From: $email - Subject: $subject\n";
    file_put_contents('contact-log.txt', $log_entry, FILE_APPEND);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or email directly.'
    ]);
}

// Optional: Send auto-reply to sender
$auto_reply_subject = "Thank you for contacting Saphal Lamsal";
$auto_reply_body = "Hi $name,\n\n";
$auto_reply_body .= "Thank you for reaching out! I have received your message and will get back to you as soon as possible.\n\n";
$auto_reply_body .= "Your message:\n$message\n\n";
$auto_reply_body .= "Best regards,\n";
$auto_reply_body .= "Saphal Lamsal\n";
$auto_reply_body .= "Developer | Cybersecurity Enthusiast | Researcher\n";
$auto_reply_body .= "https://safallamsal.com.np\n";

$auto_reply_headers = [];
$auto_reply_headers[] = "From: Saphal Lamsal <$from_email>";
$auto_reply_headers[] = "Reply-To: $from_email";
$auto_reply_headers[] = "X-Mailer: PHP/" . phpversion();
$auto_reply_headers[] = "MIME-Version: 1.0";
$auto_reply_headers[] = "Content-Type: text/plain; charset=UTF-8";

// Uncomment to enable auto-reply
// mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));

?>
