import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { auth, db, firebaseConfigured } from "./firebase.js";

const applicationState = document.getElementById("application-state");
const applicationGate = document.getElementById("application-gate");
const applicationForm = document.getElementById("application-form");
const formStatus = document.getElementById("form-status");

if (!firebaseConfigured) {
  applicationState.textContent = "Account setup is not configured yet. Please try again later.";
} else {
  onAuthStateChanged(auth, async (user) => {
    applicationState.hidden = true;
    applicationGate.hidden = true;
    applicationForm.hidden = true;

    if (!user) {
      document.getElementById("application-gate-heading").textContent = "Sign in to apply";
      document.getElementById("application-gate-copy").textContent = "Sign in and complete your profile to continue.";
      applicationGate.hidden = false;
      return;
    }

    try {
      const profileSnapshot = await getDoc(doc(db, "profiles", user.uid));
      if (!profileSnapshot.exists()) {
        document.getElementById("application-gate-heading").textContent = "Complete your profile before applying";
        document.getElementById("application-gate-copy").textContent = "Add your student and contact details to your profile to continue.";
        applicationGate.hidden = false;
        return;
      }

      const profile = profileSnapshot.data();
      const profileFields = [
        ["Full name", profile.fullName],
        ["Email address", profile.email],
        ["Phone number", profile.phone],
        ["Student number", profile.studentNumber],
        ["University", profile.university],
        ["Year of study", profile.studyYear]
      ];
      const summary = document.getElementById("profile-summary");
      summary.replaceChildren();
      for (const [label, value] of profileFields) {
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value;
        summary.append(term, description);
      }
      applicationForm.hidden = false;
    } catch (error) {
      applicationState.hidden = false;
      applicationState.textContent = `Could not load your profile: ${error.message}`;
    }
  });

  applicationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    const profileDetails = [...document.getElementById("profile-summary").children]
      .reduce((details, element, index, entries) => {
        if (index % 2 === 0) {
          details.push(`${element.textContent}: ${entries[index + 1].textContent}`);
        }
        return details;
      }, [])
      .join("\n");
    const applicantName = document.querySelector("#profile-summary dd").textContent;
    const subject = `Residence application - ${applicantName}`;
    const body = `Kwena Student Heights residence application\n\n${profileDetails}`;
    const mailto = `mailto:kwenastudentheights@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = "Your email app should open with a draft. Review the details and press Send to complete your application.";
    window.location.href = mailto;
  });
}
