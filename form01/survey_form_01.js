// ==UserScript==
// @name         Google Form Auto-Fill - Survey Form 01
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills and submits a specific Google Form 300 times with logical random data
// @author       You
// @match        https://docs.google.com/forms/d/e/1FAIpQLSelgv3TQaX8Okz1-8Demw1rk-8gNAQtycZXUlJ1Djro56VK-g/viewform*
// @icon         https://www.google.com/images/branding/product/1x/forms_48dp.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // Wait for the page to fully load
  window.addEventListener("load", function () {
    // Give extra time for dynamic content to load
    setTimeout(initScript, 2000);
  });

  function initScript() {
    console.log("Google Forms Auto-Fill: Script initialized");

    // Define comprehensive answer categories for different question types
    const shortAnswers = {
      // Personal information answers
      name: [
        "John Smith",
        "Sarah Johnson",
        "Michael Wong",
        "Priya Patel",
        "David Chen",
        "Emily Rodriguez",
        "Robert Kim",
        "Jessica Nguyen",
        "James Wilson",
        "Maria Garcia",
        "Thomas Lee",
        "Lisa Müller",
        "Daniel Jackson",
        "Sofia Hernandez",
        "Kevin Zhang",
        "Amanda Martin",
        "Ryan Thompson",
        "Olivia White",
        "Carlos Sanchez",
        "Aisha Khan",
      ],
      email: [
        "user123@gmail.com",
        "professional.email@outlook.com",
        "contact.me@yahoo.com",
        "work.address@hotmail.com",
        "personal.name@protonmail.com",
        "my.email@icloud.com",
        "business.contact@company.com",
        "info.user@domain.net",
        "primary.email@mailbox.org",
        "johnsmith@example.com",
        "sarahjones@mail.com",
        "techuser@provider.net",
      ],
      phone: [
        "+1 555-123-4567",
        "555-987-6543",
        "(555) 234-5678",
        "+44 20 1234 5678",
        "+61 2 9876 5432",
        "+33 1 23 45 67 89",
        "+81 3-1234-5678",
        "+49 30 12345678",
        "212-555-1234",
        "650-123-4567",
        "+65 6123 4567",
        "+1 (415) 555-2671",
      ],
      age: [
        "25",
        "32",
        "41",
        "28",
        "35",
        "19",
        "47",
        "23",
        "38",
        "51",
        "29",
        "44",
        "22",
        "37",
        "54",
        "31",
        "26",
        "40",
        "33",
        "45",
        "30",
        "42",
        "36",
      ],
      education: [
        "Bachelor's degree in Computer Science",
        "Master's in Business Administration (MBA)",
        "High School Diploma",
        "Associate's Degree in Graphic Design",
        "PhD in Engineering",
        "Bachelor of Arts in Communications",
        "Master's in Information Technology",
        "Bachelor's in Psychology",
        "Technical Certificate in Web Development",
        "Master of Science in Data Analytics",
        "Bachelor's in Marketing",
        "Vocational Training in Healthcare Administration",
      ],
      occupation: [
        "Customer Service Representative",
        "Software Developer",
        "Marketing Specialist",
        "Data Analyst",
        "Customer Support Agent",
        "Sales Representative",
        "UX/UI Designer",
        "Product Manager",
        "Technical Support Specialist",
        "Project Coordinator",
        "Administrative Assistant",
        "Account Manager",
        "Content Writer",
        "Business Analyst",
        "Quality Assurance Tester",
      ],
      address: [
        "123 Main Street",
        "456 Park Avenue",
        "789 Oak Drive",
        "321 Maple Road",
        "555 Pine Street, Apt 4B",
        "987 River Lane",
        "234 Broadway, Suite 300",
        "876 Highland Avenue",
        "432 Sunset Boulevard",
        "765 Forest Way",
      ],
      city: [
        "New York",
        "San Francisco",
        "Chicago",
        "Seattle",
        "Austin",
        "Boston",
        "Los Angeles",
        "Miami",
        "Denver",
        "Atlanta",
        "Portland",
        "Dallas",
        "Phoenix",
        "Philadelphia",
        "San Diego",
        "Nashville",
        "Washington DC",
      ],
      country: [
        "United States",
        "Canada",
        "United Kingdom",
        "Australia",
        "Germany",
        "France",
        "Japan",
        "Singapore",
        "South Korea",
        "Brazil",
        "India",
        "Mexico",
        "Spain",
        "Italy",
        "Netherlands",
        "Sweden",
      ],

      // Customer service and AI-related answers
      "department and role": [
        "I work in the Customer Service department as a Senior Support Representative. My role involves handling escalated customer issues and training new team members.",
        "I'm a Technical Support Specialist in the IT Customer Support department. I troubleshoot complex technical issues and develop knowledge base articles.",
        "As a Customer Experience Manager in the Operations department, I oversee quality assurance and implement process improvements.",
        "I work as a Live Chat Specialist in the Digital Support team, handling real-time customer inquiries across multiple product lines.",
        "My role is Customer Insights Analyst in the Research department, analyzing customer feedback to identify trends and improvement opportunities.",
        "I'm a Customer Success Manager in the Account Management department, focusing on customer retention and relationship building.",
        "I work in the Returns & Refunds department as a Claims Resolution Specialist, handling complex customer disputes.",
        "As a Team Lead in the Contact Center, I manage a team of 15 representatives and coordinate cross-department communication.",
      ],
      customer_service_tools: [
        "We use Zendesk for ticket management, Slack for internal communication, and a custom CRM for customer data management.",
        "Our team primarily uses Freshdesk, Microsoft Teams, and Jira for task tracking and knowledge management.",
        "We rely on Salesforce Service Cloud, Zoom for customer calls, and Confluence for our knowledge base.",
        "We use LiveAgent for chat support, HubSpot for CRM, and Monday.com for project management.",
        "Our toolkit includes ServiceNow, Microsoft Office 365, and Tableau for analytics reporting.",
        "We use Intercom for customer messaging, Asana for workflow management, and PowerBI for data visualization.",
        "Our systems include Oracle Service Cloud, Slack, and an in-house analytics dashboard for performance tracking.",
      ],
      familiar_ai_tools: [
        "I'm familiar with Chatbots powered by GPT, sentiment analysis tools, and automated email response systems.",
        "I've worked with AI-powered ticket routing, customer intent prediction, and voice recognition systems.",
        "I'm experienced with AI tools for customer segmentation, predictive analytics, and automated quality monitoring.",
        "I've used AI for knowledge base article recommendations, customer churn prediction, and automated translations.",
        "I'm familiar with AI chatbots, voice analysis software, and predictive text systems for response suggestions.",
      ],
      ai_role_customer_experience: [
        "AI can personalize customer interactions at scale by analyzing past behaviors and preferences, creating more relevant and timely experiences.",
        "AI's greatest potential is in predictive support—identifying and resolving issues before customers are even aware of them.",
        "AI can provide 24/7 consistent support across all channels while allowing human agents to focus on complex, high-value interactions.",
        "AI can transform customer experience by synthesizing data across touchpoints to create seamless, personalized journeys.",
        "AI's role is to augment human support by handling routine inquiries and providing agents with real-time information and recommendations.",
      ],
      "ai challenges": [
        "The main challenge is balancing automation with the human touch that customers still expect, especially for emotionally sensitive issues.",
        "One significant challenge is the learning curve required to effectively use and trust AI recommendations in customer interactions.",
        "A major hurdle is ensuring AI tools understand cultural nuances and context in customer communications across global markets.",
        "The biggest challenge is data privacy concerns and ensuring transparent use of customer information in AI systems.",
        "A key challenge is the integration of AI tools with existing systems and workflows without disrupting team productivity.",
      ],
      ai_personalization_impact: [
        "AI has enhanced our personalization by analyzing customer history to provide tailored recommendations, though we still review them for accuracy.",
        "AI helps us identify customer preferences and past issues, allowing for more contextually relevant and personalized service.",
        "Using AI for personalization has increased our first-contact resolution rates by providing agents with more comprehensive customer insights.",
        "AI has allowed us to scale personalization across high volumes of interactions, though we maintain human oversight for complex cases.",
        "The personalization capabilities of our AI tools have significantly improved customer satisfaction scores for repeat customers.",
      ],
      "specific example": [
        "Our AI chatbot successfully handled a high volume of password reset requests during a system update, freeing our team to manage more complex issues while maintaining fast response times.",
        "AI-powered sentiment analysis alerted us to a customer about to churn, allowing us to intervene with a personalized retention offer that saved the account.",
        "Our AI translation tool enabled seamless communication with an international customer who was having difficulty explaining a technical issue in English.",
        "The AI recommendation system suggested a product alternative to a customer looking for an out-of-stock item, resulting in a successful sale and positive feedback.",
        "Our AI-powered knowledge base significantly reduced case resolution time by automatically suggesting relevant solutions based on customer issue descriptions.",
      ],
      ai_training: [
        "More hands-on workshops with practical scenarios would help us better understand when to rely on AI suggestions versus human judgment.",
        "Regular updates on new AI features and capabilities would help us maximize the benefits of the tools available to us.",
        "Cross-team training sessions would help ensure consistent use of AI tools across different departments.",
        "More advanced training on how to review and provide feedback on AI outputs would help improve system accuracy over time.",
        "Training on explaining AI use to customers would help build transparency and trust in our automated processes.",
      ],
      "ai improvement": [
        "Implementing more sophisticated sentiment analysis could help prioritize escalations and identify at-risk customers earlier.",
        "Developing AI tools that can better understand and respond to complex, multi-part customer queries would significantly improve efficiency.",
        "Integrating AI more seamlessly across all communication channels would create more consistent customer experiences.",
        "Adding more transparency about when AI is being used and how it makes recommendations would build customer trust.",
        "Creating AI systems that learn from successful human agent interactions would continuously improve automated response quality.",
      ],
      additional_comments: [
        "I believe the balance between AI and human support will be critical for future success in customer service.",
        "As AI tools continue to evolve, ongoing training and clear guidelines for their use will be essential.",
        "The most successful implementation of AI will be one that empowers human agents rather than replacing them.",
        "Customer privacy considerations should remain at the forefront as we expand AI capabilities.",
        "The focus should be on using AI to enhance the customer experience rather than simply reducing costs.",
        "Regular feedback loops between AI systems and human agents will be crucial for continuous improvement.",
      ],
      comments: [
        "Thank you for the opportunity to provide feedback on this important topic.",
        "I appreciate being included in this research process and hope my insights are helpful.",
        "I'm excited about the future possibilities of AI in improving our customer service capabilities.",
        "This survey has prompted me to think more deeply about how we use technology in our daily work.",
        "I look forward to seeing how these insights translate into practical improvements in our systems.",
      ],
    };

    // Initialize or retrieve state from GM storage
    const formState = {
      originalFormURL: window.location.href,
      startTime: GM_getValue("startTime") || new Date().toISOString(),
      totalIterations: GM_getValue("totalIterations") || 300, // Set to 300 iterations
      currentIteration: GM_getValue("currentIteration") || 0,
      get remainingIterations() {
        return this.totalIterations - this.currentIteration;
      },
    };

    // Save the start time if this is a new session
    if (!GM_getValue("startTime")) {
      GM_setValue("startTime", formState.startTime);
      GM_setValue("originalFormURL", formState.originalFormURL);
      GM_setValue("totalIterations", formState.totalIterations);
      GM_setValue("currentIteration", formState.currentIteration);
    }

    // Check if this form matches the original one
    const savedURL = GM_getValue("originalFormURL");
    if (savedURL && savedURL !== window.location.href) {
      console.log("Different form detected. Resetting state.");
      resetState();
      formState.originalFormURL = window.location.href;
      formState.startTime = new Date().toISOString();
      formState.currentIteration = 0;
      saveState(formState);
    }

    // Save state to GM storage
    function saveState(state) {
      GM_setValue("startTime", state.startTime);
      GM_setValue("originalFormURL", state.originalFormURL);
      GM_setValue("totalIterations", state.totalIterations);
      GM_setValue("currentIteration", state.currentIteration);
      console.log(
        `Progress saved: ${state.currentIteration}/${state.totalIterations}`
      );
    }

    // Reset all stored values
    function resetState() {
      GM_deleteValue("startTime");
      GM_deleteValue("originalFormURL");
      GM_deleteValue("totalIterations");
      GM_deleteValue("currentIteration");
      console.log("State reset");
    }

    // Create a DOM element with specified attributes and styles
    function createDOMElement(
      tag,
      attributes = {},
      styles = {},
      textContent = ""
    ) {
      const element = document.createElement(tag);

      // Set attributes
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }

      // Set styles
      for (const [prop, value] of Object.entries(styles)) {
        element.style[prop] = value;
      }

      // Set text content if provided
      if (textContent) {
        element.textContent = textContent;
      }

      return element;
    }

    // Create a status display element using DOM API
    function createStatusDisplay() {
      // Remove existing status display if any
      const existingDisplay = document.getElementById("autoFillStatus");
      if (existingDisplay) existingDisplay.remove();

      // Create main container
      const statusDisplay = createDOMElement(
        "div",
        { id: "autoFillStatus" },
        {
          position: "fixed",
          top: "10px",
          right: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: "10000",
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        }
      );

      // Create header container
      const headerDiv = createDOMElement(
        "div",
        {},
        {
          marginBottom: "10px",
          borderBottom: "1px solid #555",
          paddingBottom: "5px",
        }
      );

      // Add title
      const titleText = createDOMElement(
        "strong",
        {},
        {},
        "Google Forms Auto-Fill"
      );
      headerDiv.appendChild(titleText);

      // Create pause button
      const pauseButton = createDOMElement(
        "button",
        { id: "autofill-pause" },
        {
          marginLeft: "10px",
          background: "#f44336",
          border: "none",
          color: "white",
          padding: "2px 8px",
          borderRadius: "3px",
          cursor: "pointer",
        },
        "Pause"
      );
      headerDiv.appendChild(pauseButton);

      // Create resume button
      const resumeButton = createDOMElement(
        "button",
        { id: "autofill-resume" },
        {
          marginLeft: "5px",
          background: "#4CAF50",
          border: "none",
          color: "white",
          padding: "2px 8px",
          borderRadius: "3px",
          cursor: "pointer",
        },
        "Resume"
      );
      headerDiv.appendChild(resumeButton);

      // Create reset button
      const resetButton = createDOMElement(
        "button",
        { id: "autofill-reset" },
        {
          marginLeft: "5px",
          background: "#FF9800",
          border: "none",
          color: "white",
          padding: "2px 8px",
          borderRadius: "3px",
          cursor: "pointer",
        },
        "Reset"
      );
      headerDiv.appendChild(resetButton);

      // Create progress display
      const progressDiv = createDOMElement("div", { id: "autofill-progress" });

      // Create status message display
      const statusDiv = createDOMElement(
        "div",
        { id: "autofill-status" },
        {},
        "Initializing..."
      );

      // Create iterations control container
      const iterationsDiv = createDOMElement(
        "div",
        {},
        {
          marginTop: "5px",
          fontSize: "12px",
        }
      );

      // Create label for iterations input
      const iterationsLabel = createDOMElement(
        "label",
        { for: "autofill-iterations" },
        {},
        "Total iterations: "
      );
      iterationsDiv.appendChild(iterationsLabel);

      // Create iterations input
      const iterationsInput = createDOMElement(
        "input",
        {
          id: "autofill-iterations",
          type: "number",
          min: "1",
          max: "1000",
          value: formState.totalIterations,
        },
        {
          width: "60px",
          marginRight: "5px",
        }
      );
      iterationsDiv.appendChild(iterationsInput);

      // Create update button
      const updateButton = createDOMElement(
        "button",
        { id: "autofill-update" },
        {
          background: "#2196F3",
          border: "none",
          color: "white",
          padding: "2px 8px",
          borderRadius: "3px",
          cursor: "pointer",
        },
        "Update"
      );
      iterationsDiv.appendChild(updateButton);

      // Assemble all components
      statusDisplay.appendChild(headerDiv);
      statusDisplay.appendChild(progressDiv);
      statusDisplay.appendChild(statusDiv);
      statusDisplay.appendChild(iterationsDiv);

      // Add to document
      document.body.appendChild(statusDisplay);

      // Add event listeners
      document
        .getElementById("autofill-pause")
        .addEventListener("click", () => {
          window.autoFillPaused = true;
          GM_setValue("paused", true);
          updateStatus("Paused");
        });

      document
        .getElementById("autofill-resume")
        .addEventListener("click", () => {
          window.autoFillPaused = false;
          GM_setValue("paused", false);
          updateStatus("Resuming...");
          // If on form page, continue filling
          if (isFormPage()) {
            continueAutofill();
          }
        });

      document
        .getElementById("autofill-reset")
        .addEventListener("click", () => {
          if (
            confirm(
              "Are you sure you want to reset the progress and start over?"
            )
          ) {
            resetState();
            window.location.reload();
          }
        });

      document
        .getElementById("autofill-update")
        .addEventListener("click", () => {
          const newVal = parseInt(
            document.getElementById("autofill-iterations").value
          );
          if (newVal && newVal > 0) {
            formState.totalIterations = newVal;
            saveState(formState);
            updateProgressDisplay();
          }
        });
    }

    // Update the status display
    function updateStatus(message) {
      const statusEl = document.getElementById("autofill-status");
      if (statusEl) {
        statusEl.textContent = message;
      }

      updateProgressDisplay();
    }

    // Update progress display
    function updateProgressDisplay() {
      const progressEl = document.getElementById("autofill-progress");
      if (progressEl) {
        const percent =
          (formState.currentIteration / formState.totalIterations) * 100;

        // Clear previous content
        while (progressEl.firstChild) {
          progressEl.removeChild(progressEl.firstChild);
        }

        // Create new content with DOM API
        const textNode = document.createTextNode("Progress: ");
        const strongEl = document.createElement("strong");
        strongEl.textContent = `${formState.currentIteration}/${formState.totalIterations}`;
        const percentText = document.createTextNode(
          ` (${percent.toFixed(1)}%)`
        );

        progressEl.appendChild(textNode);
        progressEl.appendChild(strongEl);
        progressEl.appendChild(percentText);
      }

      // Update iterations input
      const iterationsInput = document.getElementById("autofill-iterations");
      if (iterationsInput) {
        iterationsInput.value = formState.totalIterations;
      }
    }

    // Helper function to get a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Helper function to get random array elements
    function getRandomElements(array, count) {
      const shuffled = array.slice();
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    }

    // Helper function to safely get a random answer from a category
    function safeGetRandomAnswer(category, source = shortAnswers) {
      try {
        const answers = source[category];
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
          console.warn(
            `Category ${category} is missing or empty, using comments fallback`
          );
          return shortAnswers.comments[
            getRandomInt(0, shortAnswers.comments.length - 1)
          ];
        }
        return answers[getRandomInt(0, answers.length - 1)];
      } catch (err) {
        console.error(
          `Error getting random answer from ${category}: ${err.message}`
        );
        return "Thank you for the opportunity to provide feedback.";
      }
    }

    // Get appropriate short answer based on question content with sophisticated context analysis
    function getAppropriateShortAnswer(questionText) {
      console.log(`\n*** SELECTING ANSWER FOR QUESTION: "${questionText}" ***`);

      if (!questionText) {
        console.log("Empty question text received, returning fallback answer");
        return "Not applicable";
      }

      // Convert to lowercase for case-insensitive matching
      const text = questionText.toLowerCase();
      console.log(`Converted to lowercase: "${text}"`);

      // Create a context analysis object to track relevance scores for different categories
      const contextScore = {
        personalInfo: 0,
        customerService: 0,
        aiTechnology: 0,
        feedback: 0,
        training: 0,
        demographic: 0,
      };

      // Define category keyword patterns with scoring weights
      const categoryPatterns = {
        personalInfo: {
          keywords: [
            "name",
            "email",
            "phone",
            "age",
            "address",
            "city",
            "country",
            "contact",
            "occupation",
            "job",
            "title",
            "gender",
          ],
          weight: 10,
        },
        customerService: {
          keywords: [
            "customer",
            "service",
            "support",
            "help",
            "assist",
            "ticket",
            "satisfaction",
            "resolve",
            "issue",
            "complaint",
          ],
          weight: 5,
        },
        aiTechnology: {
          keywords: [
            "ai",
            "artificial intelligence",
            "machine learning",
            "automated",
            "chatbot",
            "robot",
            "technology",
            "digital",
            "algorithm",
          ],
          weight: 8,
        },
        feedback: {
          keywords: [
            "feedback",
            "suggest",
            "improve",
            "opinion",
            "think",
            "rate",
            "experience",
            "satisfaction",
          ],
          weight: 6,
        },
        training: {
          keywords: [
            "train",
            "learn",
            "develop",
            "skill",
            "knowledge",
            "course",
            "workshop",
            "education",
          ],
          weight: 7,
        },
        demographic: {
          keywords: [
            "demographic",
            "income",
            "education",
            "household",
            "marriage",
            "children",
            "family",
          ],
          weight: 9,
        },
      };

      // Score the question text based on keyword matches
      Object.entries(categoryPatterns).forEach(([category, pattern]) => {
        pattern.keywords.forEach((keyword) => {
          // Full word match gets full weight
          if (new RegExp(`\\b${keyword}\\b`, "i").test(text)) {
            contextScore[category] += pattern.weight;
            console.log(
              `Keyword match: "${keyword}" in category ${category} (+${pattern.weight} points)`
            );
          }
          // Partial match gets partial weight
          else if (text.includes(keyword)) {
            contextScore[category] += Math.floor(pattern.weight / 2);
            console.log(
              `Partial keyword match: "${keyword}" in category ${category} (+${Math.floor(
                pattern.weight / 2
              )} points)`
            );
          }
        });
      });

      // Log the detected context scores
      console.log(
        "Context analysis scores:",
        JSON.stringify(contextScore, null, 2)
      );

      // Try exact matches for specific questions first (high-precision matching)
      // Shopee-specific questions
      if (
        text.includes("briefly describe your department and role at shopee")
      ) {
        console.log("✓ Matched question: 'department and role at shopee'");
        return safeGetRandomAnswer("department and role");
      }

      if (text.includes("what tools/software do you use on a daily basis")) {
        console.log("✓ Matched question: 'tools/software use on daily basis'");
        return safeGetRandomAnswer("customer_service_tools");
      }

      // AI-specific questions with exact matching
      if (
        text.includes("is shopee using ai tools to support customer service") ||
        (text.includes("using ai") &&
          text.includes("support") &&
          text.includes("customer service"))
      ) {
        console.log("✓ Matched question about company using AI tools");
        return "Yes";
      }

      if (
        text.includes("are you familiar with any of the following ai tools") ||
        (text.includes("familiar") && text.includes("ai tools"))
      ) {
        console.log("✓ Matched question: 'familiar with ai tools'");
        return safeGetRandomAnswer("familiar_ai_tools");
      }

      // Questions about AI roles and impact
      if (
        (text.includes("role") &&
          text.includes("ai") &&
          text.includes("improving customer")) ||
        (text.includes("how") &&
          text.includes("ai") &&
          text.includes("improve") &&
          text.includes("customer"))
      ) {
        console.log(
          "✓ Matched question about AI's role in customer experience"
        );
        return safeGetRandomAnswer("ai_role_customer_experience");
      }

      if (
        (text.includes("rate") || text.includes("impact")) &&
        text.includes("ai") &&
        text.includes("work performance")
      ) {
        console.log("✓ Matched question about AI impact on work performance");
        return "AI has positively impacted my efficiency by automating routine tasks";
      }

      // Professional development with AI
      if (
        (text.includes("learn") || text.includes("develop")) &&
        text.includes("skills") &&
        (text.includes("ai") || text.includes("artificial intelligence"))
      ) {
        console.log("✓ Matched question about skill development with AI");
        return "The training programs have expanded my technical skills and understanding of AI systems";
      }

      // Job satisfaction with AI
      if (text.includes("job satisfaction") && text.includes("ai")) {
        console.log("✓ Matched question about AI and job satisfaction");
        return "AI tools have reduced my workload on repetitive tasks, allowing me to focus on more meaningful customer interactions";
      }

      // AI challenges
      if (text.includes("challenges") && text.includes("ai")) {
        console.log("✓ Matched question about AI challenges");
        return safeGetRandomAnswer("ai challenges");
      }

      // Comfort with AI tools
      if (
        (text.includes("comfortable") || text.includes("comfort")) &&
        text.includes("ai tools")
      ) {
        console.log("✓ Matched question about comfort with AI tools");
        return "I feel comfortable with the current AI tools after receiving proper training";
      }

      // Personalized service with AI
      if (
        (text.includes("personalized") || text.includes("customized")) &&
        text.includes("customer service") &&
        text.includes("ai")
      ) {
        console.log("✓ Matched question about AI and personalized service");
        return safeGetRandomAnswer("ai_personalization_impact");
      }

      // AI examples
      if (
        (text.includes("example") || text.includes("specific")) &&
        text.includes("ai") &&
        (text.includes("helped") || text.includes("hindered"))
      ) {
        console.log("✓ Matched question requesting specific AI examples");
        return safeGetRandomAnswer("specific example");
      }

      // AI training adequacy
      if (text.includes("adequately trained") && text.includes("ai tools")) {
        console.log("✓ Matched question about adequate AI training");
        return "Yes, but I would like more advanced training on new features";
      }

      // Training/support needs
      if (
        (text.includes("training") || text.includes("support")) &&
        text.includes("help you")
      ) {
        console.log("✓ Matched question about training or support needs");
        return safeGetRandomAnswer("ai_training");
      }

      // Training quality assessment
      if (
        text.includes("rate") &&
        text.includes("quality") &&
        text.includes("training") &&
        (text.includes("ai") || text.includes("artificial intelligence"))
      ) {
        console.log("✓ Matched question about training quality");
        return "The training covers basic functionality but could be more comprehensive with real-world scenarios";
      }

      // Suggestions for improvement
      if (
        (text.includes("suggestions") || text.includes("recommend")) &&
        text.includes("ai") &&
        (text.includes("effectively") || text.includes("better"))
      ) {
        console.log("✓ Matched question about AI improvement suggestions");
        return safeGetRandomAnswer("ai improvement");
      }

      // AI replacing humans
      if (
        text.includes("replace") &&
        text.includes("humans") &&
        text.includes("customer service") &&
        text.includes("ai")
      ) {
        console.log("✓ Matched question about AI replacing humans");
        return "AI will handle routine inquiries but human agents will remain essential for complex problem-solving, emotional support, and building customer relationships";
      }

      // Participation willingness
      if (
        text.includes("willing") &&
        text.includes("participate") &&
        text.includes("interview")
      ) {
        console.log("✓ Matched question about interview participation");
        return "Yes, I would be happy to provide more detailed feedback about my AI experiences";
      }

      // Additional comments
      if (
        (text.includes("additional") || text.includes("other")) &&
        (text.includes("comments") ||
          text.includes("feedback") ||
          text.includes("contributions"))
      ) {
        console.log("✓ Matched question about additional comments");
        return safeGetRandomAnswer("additional_comments");
      }

      // Now use the context scores to determine the best category if no exact match was found
      if (Math.max(...Object.values(contextScore)) > 0) {
        // Find the highest scoring category
        const highestCategory = Object.keys(contextScore).reduce((a, b) =>
          contextScore[a] > contextScore[b] ? a : b
        );

        console.log(
          `✓ Highest scoring category based on context: ${highestCategory} (${contextScore[highestCategory]} points)`
        );

        // Map the context category to an answer category
        switch (highestCategory) {
          case "personalInfo":
            // Check for specific personal info types
            if (text.includes("name") && text.length < 30) {
              return safeGetRandomAnswer("name");
            } else if (text.includes("email")) {
              return safeGetRandomAnswer("email");
            } else if (text.includes("phone")) {
              return safeGetRandomAnswer("phone");
            } else if (text.includes("age")) {
              return safeGetRandomAnswer("age");
            } else if (text.includes("address")) {
              return safeGetRandomAnswer("address");
            } else if (text.includes("city")) {
              return safeGetRandomAnswer("city");
            } else if (text.includes("country")) {
              return safeGetRandomAnswer("country");
            } else if (text.includes("education") || text.includes("degree")) {
              return safeGetRandomAnswer("education");
            } else if (
              text.includes("occupation") ||
              text.includes("job") ||
              text.includes("profession")
            ) {
              return safeGetRandomAnswer("occupation");
            } else {
              return safeGetRandomAnswer("name"); // Default to name as fallback
            }

          case "customerService":
            if (text.includes("tools") || text.includes("software")) {
              return safeGetRandomAnswer("customer_service_tools");
            } else if (text.includes("department") || text.includes("role")) {
              return safeGetRandomAnswer("department and role");
            } else {
              return "I focus on delivering personalized solutions and ensuring customer satisfaction through efficient problem resolution.";
            }

          case "aiTechnology":
            if (text.includes("challenges")) {
              return safeGetRandomAnswer("ai challenges");
            } else if (text.includes("impact") || text.includes("effect")) {
              return safeGetRandomAnswer("ai_role_customer_experience");
            } else if (text.includes("familiar") || text.includes("know")) {
              return safeGetRandomAnswer("familiar_ai_tools");
            } else if (text.includes("example")) {
              return safeGetRandomAnswer("specific example");
            } else {
              return "AI technology has significantly transformed our customer service operations, providing more efficient and personalized support.";
            }

          case "feedback":
            if (text.includes("suggest") || text.includes("improve")) {
              return safeGetRandomAnswer("ai improvement");
            } else {
              return safeGetRandomAnswer("additional_comments");
            }

          case "training":
            return safeGetRandomAnswer("ai_training");

          case "demographic":
            if (text.includes("age")) {
              return safeGetRandomAnswer("age");
            } else if (text.includes("education")) {
              return safeGetRandomAnswer("education");
            } else {
              return "I prefer not to provide this demographic information in this survey.";
            }

          default:
            return safeGetRandomAnswer("comments");
        }
      }

      // More general patterns as fallback
      if (text.includes("department") && text.includes("role")) {
        console.log("✓ Matched general pattern: 'department and role'");
        return safeGetRandomAnswer("department and role");
      }

      if (
        text.includes("tools") &&
        (text.includes("software") || text.includes("daily"))
      ) {
        console.log("✓ Matched general pattern: 'tools/software'");
        return safeGetRandomAnswer("customer_service_tools");
      }

      if (text.includes("name") && text.length < 25) {
        console.log("✓ Matched pattern: short question with 'name'");
        return safeGetRandomAnswer("name");
      }

      if (text.includes("email")) {
        console.log("✓ Matched pattern: question with 'email'");
        return safeGetRandomAnswer("email");
      }

      if (text.includes("phone")) {
        console.log("✓ Matched pattern: question with 'phone'");
        return safeGetRandomAnswer("phone");
      }

      if (text.includes("age")) {
        console.log("✓ Matched pattern: question with 'age'");
        return safeGetRandomAnswer("age");
      }

      // Final fallback - analyze question length for appropriate response
      console.log(
        "No specific match found. Analyzing question length for appropriate response."
      );
      if (text.length < 20) {
        console.log("Short question detected, providing concise response");
        return safeGetRandomAnswer("comments").split(".")[0] + "."; // Just the first sentence
      } else {
        console.log(
          "Longer question detected, providing full comment response"
        );
        return safeGetRandomAnswer("comments");
      }
    }

    // Enhanced function to extract specific question text from custom forms
    function extractQuestionText(container) {
      console.log("\n--- QUESTION TEXT EXTRACTION DEBUG ---");

      // First attempt: Try to find a direct label element for this question
      const labelSelectors = [
        "label",
        ".freebirdFormviewerComponentsQuestionBaseTitle",
        ".exportItemTitle",
        ".freebirdFormviewerComponentsQuestionTextRoot",
        // The actual question title is often in the first span with significant text
        ".freebirdFormviewerComponentsQuestionBaseHeader span",
        "[role='heading']",
        // Direct parent of required asterisk often contains the question title
        ".freebirdFormviewerComponentsQuestionBaseRequiredAsterisk",
        // Google Forms often puts question text in these classes
        ".docssharedWizQuestionText",
        ".freebirdFormviewerComponentsQuestionTextQuestion",
      ];

      console.log("Trying label selectors first...");

      let textElement = null;
      let questionText = "";

      // Attempt to find any label or title element
      for (const selector of labelSelectors) {
        const elements = container.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
            // Get either the element itself or its parent if the element is the required asterisk
            const element = selector.includes("Asterisk")
              ? elements[i].parentElement
              : elements[i];
            const text = element.textContent.trim();

            if (
              text &&
              text.length > 5 &&
              !text.includes("*") &&
              text !== "Other:"
            ) {
              console.log(`  Found text with selector ${selector}: "${text}"`);
              textElement = element;
              questionText = text;
              console.log(`  Using question text: "${questionText}"`);
              return questionText;
            }
          }
        }
      }

      // Second attempt: Try to find any spans with substantial text
      if (!textElement) {
        console.log("No label found, looking for substantial text in spans...");
        const spans = container.querySelectorAll("span");
        const textCandidates = Array.from(spans)
          .map((span) => ({
            element: span,
            text: span.textContent.trim(),
          }))
          .filter((item) => item.text.length > 15)
          .sort((a, b) => b.text.length - a.text.length); // Sort by text length descending

        if (textCandidates.length > 0) {
          textElement = textCandidates[0].element;
          questionText = textCandidates[0].text;
          console.log(`  Found span with substantial text: "${questionText}"`);
          return questionText;
        }
      }

      // Third attempt: Look for div elements with text
      if (!textElement) {
        console.log("No spans with substantial text, trying div elements...");
        const divs = container.querySelectorAll("div");
        const textCandidates = Array.from(divs)
          .filter((div) => div.childElementCount <= 2) // Avoid complex containers
          .map((div) => ({
            element: div,
            text: div.textContent.trim(),
          }))
          .filter((item) => item.text.length > 10 && item.text.length < 200) // Reasonable question length
          .sort((a, b) => b.text.length - a.text.length); // Sort by text length descending

        if (textCandidates.length > 0) {
          textElement = textCandidates[0].element;
          questionText = textCandidates[0].text;
          console.log(`  Found div with appropriate text: "${questionText}"`);
          return questionText;
        }
      }

      // If we reach here and still don't have text, find any element with visible text
      if (!textElement) {
        console.log(
          "Last resort: looking for any element with visible text..."
        );
        const allElements = container.querySelectorAll("*");
        for (const el of allElements) {
          if (
            el.childNodes.length > 0 &&
            el.textContent &&
            el.textContent.trim().length > 10 &&
            el.textContent.trim().length < 300 &&
            !el.textContent.includes("*") &&
            getComputedStyle(el).display !== "none" &&
            getComputedStyle(el).visibility !== "hidden"
          ) {
            questionText = el.textContent.trim();
            console.log(`  Last resort found text: "${questionText}"`);
            return questionText;
          }
        }
      }

      console.log("Could not extract question text through normal methods");
      return `Question (no text found)`;
    }

    // Analyze form structure with robust detection
    function analyzeFormStructure() {
      console.log("Analyzing form structure...");

      const selectors = [
        ".freebirdFormviewerViewItemsItemItem",
        ".freebirdFormviewerViewNumberedItemContainer",
        ".freebirdFormviewerComponentsQuestionRoot",
        "div[role='listitem']",
        ".freebirdFormviewerViewItemsList > div",
        ".m2",
        ".freebirdFormviewerViewItemsPagebreakContainer",
        ".freebirdFormviewerComponentsQuestionBaseRoot",
        ".freebirdFormeditorViewItemContent",
      ];

      let questionContainers = [];
      let usedSelector = "";

      for (const selector of selectors) {
        questionContainers = document.querySelectorAll(selector);
        if (questionContainers.length > 0) {
          console.log(
            `Found ${questionContainers.length} question containers using selector: ${selector}`
          );
          usedSelector = selector;
          break;
        }
      }

      if (questionContainers.length === 0) {
        console.error(
          "Could not find any question containers with standard selectors"
        );
        console.log("Running deeper debug analysis...");
        debugFormStructure();
        return [];
      }

      window.successfulQuestionSelector = usedSelector;

      const analyzedQuestions = [];
      questionContainers.forEach((container, index) => {
        console.log(`\n--- DETAILED CONTAINER ${index + 1} DEBUG ---`);
        console.log("Container HTML structure:");
        console.log(container.outerHTML.substring(0, 300) + "... (truncated)");

        // Use our new extractQuestionText function to get the question text more reliably
        const questionText = extractQuestionText(container);
        console.log(`Question ${index + 1} final text: "${questionText}"`);

        const questionInfo = {
          index: index + 1,
          text: questionText,
          element: container,
          type: "unknown",
          hasShortAnswerField: false,
          required:
            container.querySelector(
              ".freebirdFormviewerComponentsQuestionBaseRequiredAsterisk"
            ) !== null,
        };

        const shortAnswerInputs = [
          ...container.querySelectorAll('input[type="text"]'),
          ...container.querySelectorAll('input[type="email"]'),
          ...container.querySelectorAll('input[type="number"]'),
          ...container.querySelectorAll(".quantumWizTextinputPaperinputInput"),
          ...container.querySelectorAll(".exportInput"),
          ...container.querySelectorAll(
            ".freebirdFormviewerComponentsTextInputInput"
          ),
          ...container.querySelectorAll(".freebirdThemedInput"),
        ];

        if (shortAnswerInputs.length > 0) {
          questionInfo.type = "short_answer";
          questionInfo.hasShortAnswerField = true;
          questionInfo.shortAnswerInput = shortAnswerInputs[0];
          console.log(`  Type: Short answer question`);
        }

        const radioSelectors = [
          '[role="radio"]',
          ".appsMaterialWizToggleRadiogroupRadioButtonContainer",
          ".docssharedWizToggleLabeledControl",
        ];
        let radioOptions = [];

        for (const selector of radioSelectors) {
          radioOptions = container.querySelectorAll(selector);
          if (radioOptions.length > 0) break;
        }

        if (radioOptions.length > 0) {
          console.log(
            `  Type: Radio question with ${radioOptions.length} options`
          );
          questionInfo.type = "radio";
          questionInfo.options = [];

          radioOptions.forEach((option, i) => {
            // Get more accurate option text
            let label = option.textContent.trim();

            // Sometimes the text is in a child element
            if (label.length < 2) {
              const labelEl =
                option.querySelector("label") ||
                option.querySelector(".exportLabel") ||
                option.parentNode.querySelector("label");
              if (labelEl) {
                label = labelEl.textContent.trim();
              }
            }

            const hasTextField =
              option.closest("div").querySelector('input[type="text"]') !==
              null;

            questionInfo.options.push({
              element: option,
              text: label,
              hasTextField: hasTextField,
            });

            console.log(
              `    Option ${i + 1}: "${label}"${
                hasTextField ? " (has text field)" : ""
              }`
            );
          });
        }

        const checkboxSelectors = [
          '[role="checkbox"]',
          ".freebirdFormviewerComponentsQuestionCheckboxChoice",
          ".appsMaterialWizToggleCheckboxCheckbox",
        ];
        let checkboxOptions = [];

        for (const selector of checkboxSelectors) {
          checkboxOptions = container.querySelectorAll(selector);
          if (checkboxOptions.length > 0) break;
        }

        if (checkboxOptions.length > 0) {
          console.log(
            `  Type: Checkbox question with ${checkboxOptions.length} options`
          );
          questionInfo.type = "checkbox";
          questionInfo.options = [];

          checkboxOptions.forEach((option, i) => {
            // Get better checkbox option text
            let label = option.textContent.trim();

            // Check for label in parent or siblings
            if (label.length < 2) {
              const labelEl =
                option.closest("div").querySelector("label") ||
                option.parentElement.querySelector(".exportLabel") ||
                option.parentNode.querySelector("[role='heading']");
              if (labelEl) {
                label = labelEl.textContent.trim();
              }
            }

            const hasTextField =
              option.closest("div").querySelector('input[type="text"]') !==
              null;

            questionInfo.options.push({
              element: option,
              text: label,
              hasTextField: hasTextField,
            });

            console.log(
              `    Option ${i + 1}: "${label}"${
                hasTextField ? " (has text field)" : ""
              }`
            );
          });
        }

        const textAreaSelectors = [
          "textarea",
          ".exportTextarea",
          ".freebirdFormviewerComponentsQuestionTextLong",
          ".freebirdFormviewerComponentsQuestionTextRoot",
        ];
        let textAreaInput = null;

        for (const selector of textAreaSelectors) {
          textAreaInput = container.querySelector(selector);
          if (textAreaInput) break;
        }

        if (textAreaInput) {
          console.log(`  Type: Text input question (paragraph)`);
          questionInfo.type = "text";
          questionInfo.input = textAreaInput;
        }

        const dropdownSelectors = [
          "select",
          ".freebirdFormviewerComponentsQuestionSelectRoot",
          ".quantumWizMenuPaperselectOption",
        ];

        let dropdown = null;
        for (const selector of dropdownSelectors) {
          dropdown = container.querySelector(selector);
          if (dropdown) break;
        }

        if (dropdown) {
          console.log(`  Type: Dropdown select question`);
          questionInfo.type = "dropdown";
          questionInfo.dropdown = dropdown;
        }

        const dateInputs = container.querySelectorAll('input[type="date"]');
        if (dateInputs.length > 0) {
          console.log(`  Type: Date input question`);
          questionInfo.type = "date";
          questionInfo.dateInput = dateInputs[0];
        }

        if (container.querySelector(".freebirdMaterialScalecontentContainer")) {
          console.log(`  Type: Linear scale question`);
          questionInfo.type = "scale";
          questionInfo.scaleOptions =
            container.querySelectorAll('[role="radio"]');
        }

        // Final summary for this question
        console.log(`Question ${index + 1} summary:`);
        console.log(`  Final text: "${questionInfo.text}"`);
        console.log(`  Type: ${questionInfo.type}`);
        console.log(`  Required: ${questionInfo.required}`);

        analyzedQuestions.push(questionInfo);
      });

      console.log(
        `Form analysis complete. Found ${analyzedQuestions.length} questions.`
      );
      return analyzedQuestions;
    }

    async function fillFormWithRandomData() {
      try {
        console.log("Starting to fill form with random data...");

        const questions = analyzeFormStructure();

        if (questions.length === 0) {
          console.error(
            "No questions found! The form may not be loaded correctly."
          );
          return false;
        }

        console.log(`Found ${questions.length} questions total`);

        // Process each question
        for (const questionInfo of questions) {
          console.log(
            `Processing question ${questionInfo.index}: ${questionInfo.text}`
          );

          if (questionInfo.type === "radio") {
            // Handle radio buttons - select one random option
            if (questionInfo.options && questionInfo.options.length > 0) {
              const randomIndex = getRandomInt(
                0,
                questionInfo.options.length - 1
              );
              const selectedOption = questionInfo.options[randomIndex];

              // Click the option
              selectedOption.element.click();
              console.log(`Selected radio option: ${selectedOption.text}`);

              // If this option has a text field, fill it too
              if (selectedOption.hasTextField) {
                const textField = selectedOption.element
                  .closest("div")
                  .querySelector('input[type="text"]');
                if (textField) {
                  try {
                    const textValue = getAppropriateShortAnswer(
                      questionInfo.text || "Other option"
                    );
                    textField.value = textValue;
                    textField.dispatchEvent(
                      new Event("input", { bubbles: true })
                    );
                    console.log(
                      `Filled text field for radio option with: ${textValue}`
                    );
                  } catch (err) {
                    console.error(`Error filling text field: ${err.message}`);
                    // Fallback value if there's an error
                    textField.value = "Additional information";
                    textField.dispatchEvent(
                      new Event("input", { bubbles: true })
                    );
                  }
                }
              }
            }
          } else if (questionInfo.type === "checkbox") {
            // Handle checkboxes - select 1 to 3 random options
            if (questionInfo.options && questionInfo.options.length > 0) {
              // Determine how many to check (between 1 and 3, but not more than available)
              const numToCheck = Math.min(
                getRandomInt(1, 3),
                questionInfo.options.length
              );
              const selectedIndices = [];

              // Generate unique random indices
              while (selectedIndices.length < numToCheck) {
                const randomIndex = getRandomInt(
                  0,
                  questionInfo.options.length - 1
                );
                if (!selectedIndices.includes(randomIndex)) {
                  selectedIndices.push(randomIndex);
                }
              }

              // Click each selected checkbox
              for (const index of selectedIndices) {
                const selectedOption = questionInfo.options[index];
                selectedOption.element.click();
                console.log(`Selected checkbox option: ${selectedOption.text}`);

                // If this option has a text field, fill it
                if (selectedOption.hasTextField) {
                  const textField = selectedOption.element
                    .closest("div")
                    .querySelector('input[type="text"]');
                  if (textField) {
                    try {
                      const textValue = getAppropriateShortAnswer(
                        questionInfo.text || "Other option"
                      );
                      textField.value = textValue;
                      textField.dispatchEvent(
                        new Event("input", { bubbles: true })
                      );
                      console.log(
                        `Filled text field for checkbox option with: ${textValue}`
                      );
                    } catch (err) {
                      console.error(
                        `Error filling checkbox text field: ${err.message}`
                      );
                      // Fallback value if there's an error
                      textField.value = "Additional information for checkbox";
                      textField.dispatchEvent(
                        new Event("input", { bubbles: true })
                      );
                    }
                  }
                }
              }
            }
          } else if (questionInfo.type === "short_answer") {
            // Handle short answer fields
            if (questionInfo.shortAnswerInput) {
              const textValue = getAppropriateShortAnswer(questionInfo.text);
              questionInfo.shortAnswerInput.value = textValue;
              questionInfo.shortAnswerInput.dispatchEvent(
                new Event("input", { bubbles: true })
              );
              console.log(`Filled short answer with: ${textValue}`);
            }
          } else if (questionInfo.type === "text") {
            // Handle text areas (paragraph answers)
            if (questionInfo.input) {
              const textValue = getAppropriateShortAnswer(questionInfo.text);
              questionInfo.input.value = textValue;
              questionInfo.input.dispatchEvent(
                new Event("input", { bubbles: true })
              );
              console.log(`Filled text area with: ${textValue}`);
            }
          } else if (questionInfo.type === "dropdown") {
            await handleDropdownQuestion(questionInfo);
          } else if (questionInfo.type === "scale") {
            await handleScaleQuestion(questionInfo);
          }

          // Add a small delay between field interactions
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log("Form filled with random data successfully!");
        return true;
      } catch (error) {
        console.error(`Error filling form with random data: ${error.message}`);
        return false;
      }
    }

    async function handleDropdownQuestion(questionInfo) {
      try {
        const dropdown = questionInfo.dropdown;

        if (dropdown.tagName.toLowerCase() === "select") {
          const options = Array.from(dropdown.querySelectorAll("option")).slice(
            1
          ); // Skip first option (usually prompt)

          if (options.length > 0) {
            const randomIndex = getRandomInt(0, options.length - 1);
            dropdown.selectedIndex = randomIndex + 1;

            dropdown.dispatchEvent(new Event("change", { bubbles: true }));
            console.log(
              `Selected dropdown option: ${options[randomIndex].textContent}`
            );
          }
        } else {
          // Handle custom Google Forms dropdowns
          dropdown.click();

          setTimeout(() => {
            const options = document.querySelectorAll(
              ".quantumWizMenuPaperselectOption"
            );
            if (options.length > 1) {
              const randomIndex = getRandomInt(1, options.length - 1);
              options[randomIndex].click();
              console.log(
                `Selected custom dropdown option: ${options[randomIndex].textContent}`
              );
            }
          }, 300);
        }

        return true;
      } catch (error) {
        console.error(`Error handling dropdown question: ${error.message}`);
        return false;
      }
    }

    async function handleScaleQuestion(questionInfo) {
      try {
        const scaleOptions = questionInfo.scaleOptions;

        if (scaleOptions && scaleOptions.length > 0) {
          const randomIndex = getRandomInt(0, scaleOptions.length - 1);
          scaleOptions[randomIndex].click();
          console.log(
            `Selected scale option ${randomIndex + 1} of ${scaleOptions.length}`
          );
          return true;
        }

        return false;
      } catch (error) {
        console.error(`Error handling scale question: ${error.message}`);
        return false;
      }
    }

    /**
     * Finds and clicks the submit button on the form
     * @returns {Promise<boolean>} - true if submission was successful
     */
    async function submitForm() {
      try {
        // Look for the submit button using various selectors
        const submitButton =
          document.querySelector('div[role="button"][jsname="OCpkoe"]') || // Primary submit button
          document.querySelector('div[role="button"][jsname="M2UYVd"]') || // Another possible submit element
          document.querySelector(
            "span.appsMaterialWizButtonPaperbuttonLabel"
          ) || // Text inside button
          document.querySelector('button[type="submit"]') || // Standard submit button
          [...document.querySelectorAll('div[role="button"]')].find(
            (el) =>
              el.textContent.trim().toLowerCase() === "submit" ||
              el.textContent.trim().toLowerCase() === "send" ||
              el.textContent.trim().toLowerCase() === "next"
          );

        if (submitButton) {
          console.log("Submit button found, clicking...");
          submitButton.click();

          // Wait a moment to see if the form changes state
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Check if we're no longer on the form page (likely successful)
          if (!isFormPage() || isConfirmationPage()) {
            console.log("Form submitted successfully!");
            return true;
          } else {
            console.log(
              "Form appears to still be displayed after submit attempt"
            );
            return false;
          }
        } else {
          console.log("Submit button not found");
          return false;
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        return false;
      }
    }

    /**
     * Returns to the form page after submission
     */
    async function returnToForm() {
      try {
        // Look for "Submit another response" link
        const submitAnotherLink =
          document.querySelector('a[jsname="A5KGRe"]') ||
          [...document.querySelectorAll("a")].find(
            (el) =>
              el.textContent.includes("Submit another response") ||
              el.textContent.includes("Submit another")
          );

        if (submitAnotherLink) {
          console.log("Found 'Submit another response' link, clicking...");
          submitAnotherLink.click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          return;
        }

        // If not found, try to go back to the original form URL
        console.log("Navigation link not found, returning to form URL...");
        window.location.href = formState.originalFormURL;
      } catch (error) {
        console.error("Error returning to form:", error);
        // Fallback to original URL
        window.location.href = formState.originalFormURL;
      }
    }

    /**
     * Checks if we're on a confirmation page after submission
     */
    function isConfirmationPage() {
      // Look for elements typically found on confirmation pages
      return Boolean(
        document.querySelector(
          ".freebirdFormviewerViewResponseConfirmationMessage"
        ) ||
          document.querySelector('a[jsname="A5KGRe"]') || // "Submit another response" link
          document.querySelector(
            ".freebirdFormviewerViewResponseConfirmationCard"
          ) ||
          [...document.querySelectorAll("div")].some(
            (el) =>
              el.textContent.includes("Your response has been recorded") ||
              el.textContent.includes("Thank you for submitting")
          )
      );
    }

    function waitForFormToLoad() {
      return new Promise((resolve) => {
        const maxAttempts = 30;
        let attempts = 0;

        const checkForm = () => {
          attempts++;
          console.log(
            `Checking if form is loaded (attempt ${attempts}/${maxAttempts})...`
          );

          // Check for form elements
          if (isFormPage()) {
            console.log("Form appears to be loaded");
            // Give extra time for any animations or delayed content to finish loading
            setTimeout(resolve, 3000);
          } else if (attempts >= maxAttempts) {
            console.log("Max attempts reached waiting for form to load");
            debugFormStructure();
            setTimeout(resolve, 1000);
          } else {
            setTimeout(checkForm, 1000);
          }
        };

        checkForm();
      });
    }

    async function fillOneIteration() {
      try {
        updateStatus(
          `Filling form (iteration ${formState.currentIteration + 1}/${
            formState.totalIterations
          })...`
        );

        await waitForFormToLoad();
        updateStatus("Form loaded, filling with random data...");

        const fillSuccess = await fillFormWithRandomData();

        if (!fillSuccess) {
          console.error(
            "Failed to fill form properly, trying to navigate back to form"
          );
          updateStatus("Failed to fill form, reloading...");
          await returnToForm();
          return;
        }

        updateStatus("Submitting form...");
        const submitted = await submitForm();

        console.log(
          "Form submission result:",
          submitted ? "Success" : "May have failed"
        );

        if (submitted) {
          formState.currentIteration++;
          saveState(formState);
          updateProgressDisplay();

          if (formState.currentIteration < formState.totalIterations) {
            updateStatus(
              `Form submitted! (${formState.currentIteration}/${formState.totalIterations})`
            );
            await returnToForm();
          } else {
            updateStatus(
              `All done! Completed ${formState.totalIterations} submissions.`
            );
            console.log("All iterations completed!");
          }
        } else {
          updateStatus("Form submission may have failed, retrying...");
          await returnToForm();
        }
      } catch (error) {
        console.error(`Error during form filling: ${error.message}`);
        updateStatus(`Error occurred: ${error.message}`);

        setTimeout(async () => {
          await returnToForm();
        }, 3000);
      }
    }

    async function continueAutofill() {
      if (window.autoFillPaused || GM_getValue("paused") === true) {
        window.autoFillPaused = true;
        updateStatus("Paused");
        return;
      }

      if (formState.currentIteration >= formState.totalIterations) {
        updateStatus(
          `All done! Completed ${formState.totalIterations} submissions.`
        );
        return;
      }

      if (isFormPage()) {
        await fillOneIteration();

        // If form is still displayed after filling, attempt to submit it
        if (isFormPage()) {
          console.log(
            "Form still displaying after fill, attempting to submit..."
          );
          updateStatus("Attempting to submit form...");

          const submitSuccess = await submitForm();
          if (submitSuccess) {
            console.log("Form submitted successfully after retry!");
            formState.currentIteration++;
            saveState(formState);
            updateProgressDisplay();

            if (formState.currentIteration < formState.totalIterations) {
              updateStatus(
                `Form submitted! (${formState.currentIteration}/${formState.totalIterations})`
              );
              await returnToForm();
            } else {
              updateStatus(
                `All done! Completed ${formState.totalIterations} submissions.`
              );
            }
          } else {
            console.log("Still unable to submit form, attempting to reload...");
            updateStatus("Submit failed, reloading form...");
            await returnToForm();
          }
        }
      } else if (isConfirmationPage()) {
        updateStatus("On confirmation page, returning to form...");
        await returnToForm();
      } else {
        updateStatus("Not on form page, attempting to navigate to form...");
        window.location.href = formState.originalFormURL;
      }
    }

    // Check if we're on the form page
    function isFormPage() {
      return (
        document.querySelectorAll(
          '[role="radio"], [role="checkbox"], textarea, input[type="text"]'
        ).length > 0 || document.querySelector("form") !== null
      );
    }

    function initAutofill() {
      createStatusDisplay();

      window.autoFillPaused = GM_getValue("paused") === true;

      if (window.autoFillPaused) {
        updateStatus("Paused - click Resume to continue");
      } else {
        updateStatus("Starting...");
      }

      updateProgressDisplay();

      if (!window.autoFillPaused) {
        setTimeout(() => {
          continueAutofill();
        }, 1000);
      }
    }

    initAutofill();
  }
})();
