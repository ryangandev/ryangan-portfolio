import ContactInfo from './contact-info';
import ContactForm from './contact-form';

/**
 * The fade is a CSS animation rather than a JS one so the section is painted
 * by the server-rendered HTML: it starts visible to anyone without JavaScript
 * and never waits on hydration to appear.
 */
const Contact = () => {
  return (
    <section
      id="contact"
      className="motion-safe:animate-in motion-safe:duration-1000 motion-safe:fade-in"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
};

export default Contact;
