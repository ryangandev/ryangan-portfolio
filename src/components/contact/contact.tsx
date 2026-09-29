import ContactInfo from './contact-info';
import ContactForm from './contact-form';

/**
 * The form, then every other way to reach me. Both are rows beside a label
 * column, 160px from `md` up like the blog archive's years, so the page reads
 * as one list.
 *
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
      <ContactForm />
      <h2>Elsewhere</h2>
      <ContactInfo />
    </section>
  );
};

export default Contact;
