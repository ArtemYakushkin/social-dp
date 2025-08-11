import { useEffect } from "react";

import EnFlag from "../../assets/united-kingdom.png";
import UaFlag from "../../assets/ukraine.png";
import Security from "../../assets/encrypted.png";
import Hands from "../../assets/handshake.png";

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy">
      <div className="container">
        <div className="privacy-box">
          <div className="privacy-title-box">
            <img src={Security} alt="Security" />
            <h2 className="sectionTitle">Privacy Policy / Політика конфіденційності</h2>
          </div>

          <div className="privacy-title-box">
            <img src={EnFlag} alt="Uk" />
            <h5 className="postTitle">English</h5>
          </div>
          <ul className="privacy-list">
            <li className="textMain">1. We care about your privacy.</li>
            <li className="textMain">
              2. To use this platform, you only need to enter your country and nickname.
            </li>
            <li className="textMain">
              3. Please don’t share personal data (your full name, phone number, or email) in posts
              or comments.
            </li>
            <li className="textMain">4. We don’t collect, share or sell your personal data.</li>
            <li className="textMain">5. If you want to delete your profile — just contact us.</li>
          </ul>

          <div className="privacy-title-box">
            <img src={UaFlag} alt="Ua" />
            <h5 className="postTitle">Українська</h5>
          </div>
          <ul className="privacy-list">
            <li className="textMain">1. Ми піклуємося про вашу конфіденційність.</li>
            <li className="textMain">
              2. Щоб користуватись платформою, достатньо вказати країну та нікнейм.
            </li>
            <li className="textMain">
              3. Будь ласка, не публікуйте особисту інформацію (повне ім’я, номер телефону, email) у
              постах або коментарях.
            </li>
            <li className="textMain">
              4. Ми не збираємо, не передаємо і не продаємо ваші персональні дані.
            </li>
            <li className="textMain">5. Якщо ви хочете видалити профіль — просто напишіть нам.</li>
          </ul>
        </div>

        <div className="privacy-box">
          <div className="privacy-title-box">
            <img src={Hands} alt="Hands" />
            <h2 className="sectionTitle">Respect Code / Правила спілкування</h2>
          </div>

          <div className="privacy-title-box">
            <img src={EnFlag} alt="Uk" />
            <h5 className="postTitle">English</h5>
          </div>
          <ul className="privacy-list">
            <li className="textMain">1. Be kind. Be respectful.</li>
            <li className="textMain">2. No bad words or hate speech.</li>
            <li className="textMain">3. No phone numbers or emails in comments.</li>
            <li className="textMain">4. Don’t pretend to be someone else.</li>
            <li className="textMain">5. Let’s make this space friendly for everyone. </li>
          </ul>

          <div className="privacy-title-box">
            <img src={UaFlag} alt="Ua" />
            <h5 className="postTitle">Українська</h5>
          </div>
          <ul className="privacy-list">
            <li className="textMain">1. Будь доброзичливими. Поважайте інших.</li>
            <li className="textMain">2. Без поганих слів і мови ненависті.</li>
            <li className="textMain">3. Не публікуйте телефони чи email-адреси.</li>
            <li className="textMain">4. Не видавайте себе за інших.</li>
            <li className="textMain">5. Давайте зробимо це місце дружнім для всіх.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
