<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name    = htmlspecialchars(trim($_POST["name"]));
  $email   = htmlspecialchars(trim($_POST["email"]));
  $subject = htmlspecialchars(trim($_POST["subject"]));
  $message = htmlspecialchars(trim($_POST["message"]));

  $to      = "learnsocratian@yahoo.com"; // Replace with your actual email
  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8";

  $email_body = "Name: $name\n";
  $email_body .= "Email: $email\n";
  $email_body .= "Subject: $subject\n\n";
  $email_body .= "Message:\n$message\n";

  if (mail($to, $subject, $email_body, $headers)) {
    echo "Message sent successfully!";
  } else {
    echo "Failed to send message.";
  }
}
?>
