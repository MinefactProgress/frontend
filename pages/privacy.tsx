import { IconCookie } from "@tabler/icons";
import { Page } from "../components/Page";

const Privacy = () => {
  return (
    <Page name="Privacy Policy" icon={<IconCookie />}>
      <h1>Privacy Policy</h1>
      <div style={{ maxWidth: "800px" }}>
        <h2>Personal Information We Collect About You</h2>
        <p>
          We take the privacy and security of our users very seriously. As part
          of our commitment to providing a secure platform, we may collect and
          store IP addresses for security purposes.
        </p>
        <p>
          When you access our platform, our servers automatically log your IP
          address. We use this information to help protect our platform against
          malicious activity, such as hacking attempts, spamming, or other forms
          of abuse. We may also use IP addresses to identify and track potential
          security threats, or to investigate security incidents or other
          violations of our terms of service.
        </p>
        <p>
          We will only use IP addresses for security purposes and will not share
          or sell this information to third parties, except as required by law
          or to comply with a valid legal process.
        </p>
        <p>
          We will delete IP addresses after 24 hours. This retention period
          allows us to identify and address potential security threats and
          investigate security incidents, while minimizing the amount of time we
          retain personal data.
        </p>
        <p>
          In some cases, we may use third-party security tools or services to
          help protect our platform against attacks. These tools may also
          collect and store IP addresses as part of their security protocols. We
          will ensure that any third-party security tools or services we use are
          in compliance with applicable data privacy laws and have appropriate
          safeguards in place to protect your data.
        </p>
        <p>
          By using our platform, you acknowledge and consent to the collection
          and storage of your IP address for security purposes, as well as the
          deletion of IP addresses after 24 hours, as described in this privacy
          policy.
        </p>
        <p>
          This privacy policy is subject to change at any time. Any updates or
          changes to this policy will be posted on our website and will become
          effective immediately upon posting.
        </p>
      </div>
    </Page>
  );
};

export default Privacy;
