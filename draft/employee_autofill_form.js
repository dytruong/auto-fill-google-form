// ==UserScript==
// @name         Google Forms Auto-Fill for FPT Telecom Customer AI Survey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills and submits FPT Telecom Customer AI Survey Form multiple times with random data
// @author       You
// @match        https://docs.google.com/forms/d/e/1FAIpQLSdEbkkieMn9kAP4hKLgq3KK0Ni4FJx_YyNkmfgMZ6jPvYByQQ/viewform*
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
      // Simple answers for short answer questions
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
      ],

      // Customer AI benefit responses
      customer_ai_benefits: [
        "AI provides me with personalized recommendations that truly match my needs.",
        "The AI chatbot helps me resolve basic issues without having to wait for a customer service representative.",
        "AI-driven troubleshooting has made resolving technical problems much faster than before.",
        "I appreciate how AI analyzes my usage patterns to suggest appropriate service plans.",
        "The personalized offers I receive based on AI analysis of my usage seem more relevant than generic promotions.",
        "AI has made the customer service experience more seamless across different channels.",
        "The predictive maintenance alerts have helped me avoid service disruptions.",
        "AI-powered search functions make finding information on the website much easier.",
        "I've noticed fewer service outages, likely due to AI systems monitoring network performance.",
        "The voice recognition system in the customer service line understands me better than older systems.",
      ],

      // AI service improvement suggestions
      ai_improvement_suggestions: [
        "FPT Telecom should implement more advanced AI chatbots that can handle complex customer inquiries without human handoff.",
        "Develop AI algorithms that can predict and prevent network issues before they affect customers.",
        "Create more transparent AI systems where customers understand how their data is being used for personalization.",
        "Implement voice assistants integrated with service accounts for hands-free account management and troubleshooting.",
        "Develop AI systems that can analyze call quality in real-time and automatically adjust network parameters to improve it.",
        "Create AI systems that learn from individual customer preferences over time to provide truly personalized experiences.",
        "Implement AI that can analyze social media sentiment and quickly address public concerns about service issues.",
        "Develop more sophisticated recommendation engines that consider family usage patterns for multi-user accounts.",
        "Create AI systems that can predict when a customer might need an upgrade based on changing usage patterns.",
        "Implement augmented reality tools with AI assistance for self-installation and troubleshooting of equipment.",
        "Develop AI systems that automatically compensate customers when service levels fall below promised thresholds.",
        "Create more personalized marketing that considers customer communication preferences and optimizes timing.",
        "Implement AI-driven security systems that can detect and prevent unusual usage patterns indicating potential fraud.",
        "Develop cross-channel AI that maintains conversation context when customers switch between chat, phone, and in-person support.",
        "Create AI systems that can better understand cultural nuances and regional preferences in customer communications.",
      ],

      // Future AI features for FPT Telecom
      future_ai_features: [
        "Smart home integration that uses AI to optimize network resources based on connected device usage patterns.",
        "AI-powered virtual reality services for immersive entertainment and educational experiences.",
        "Intelligent bandwidth allocation that automatically prioritizes critical applications during peak usage times.",
        "Proactive customer service that contacts me when AI detects potential issues with my service before I notice them.",
        "Advanced voice assistants specifically designed for telecom services and troubleshooting.",
        "AI-driven recommendation systems for entertainment content across multiple streaming platforms.",
        "Personalized cybersecurity services that adapt to my specific online behavior and potential threats.",
        "Predictive maintenance for home equipment with automated scheduling for replacements before failure.",
        "AI systems that can translate technical support into simple language based on customer technical proficiency.",
        "Location-based service optimization that improves connectivity in places I frequently visit.",
        "Smart billing systems that suggest ways to optimize my plans based on my actual usage patterns.",
        "Advanced parental controls with AI that adapts restrictions based on age-appropriate content recognition.",
        "Enhanced visual troubleshooting using augmented reality guided by AI for complex setup procedures.",
        "Voice biometric authentication for secure account access without remembering passwords or security questions.",
        "Community-based AI solutions that optimize neighborhood connectivity during peak usage times.",
      ],

      // AI investment recommendations with reasoning
      ai_investment_reasons: [
        "Yes, FPT Telecom should invest more in AI because it can significantly improve network reliability through predictive maintenance, which is crucial for customer satisfaction in the telecom industry.",
        "I would recommend increased investment in AI because personalized customer experiences drive loyalty and reduce churn, which is more cost-effective than acquiring new customers.",
        "Definitely, as AI-driven automation can reduce operational costs while improving service quality, creating a competitive advantage in the price-sensitive telecom market.",
        "Yes, AI investments should be increased because customers now expect personalized experiences across all service touchpoints, and companies without advanced AI capabilities will fall behind competitors.",
        "I recommend increased AI investment, particularly in natural language processing, to improve customer support experiences and reduce resolution times.",
        "FPT Telecom should increase AI investments because predictive analytics can optimize network capacity planning, reducing both capital expenditure and improving service quality.",
        "Yes, but with a focus on transparent AI that customers can understand and trust, as this will be a key differentiator in the market as AI becomes more prevalent.",
        "I recommend careful, targeted AI investments in areas with clear customer benefits, such as service personalization and network optimization, rather than implementing AI across all operations at once.",
        "Yes, but FPT should ensure any AI implementation maintains the human connection customers value, using AI to enhance rather than replace meaningful customer interactions.",
        "Increased AI investment is justified if it focuses on solving real customer pain points rather than just following technology trends.",
        "I would recommend targeted AI investments that can demonstrate clear ROI through improved customer satisfaction metrics and operational efficiency.",
        "Yes, but FPT should also invest in AI ethics and governance frameworks to ensure responsible use of customer data and algorithm transparency.",
        "AI investments should be increased but paired with comprehensive employee training to ensure human staff can work effectively alongside AI systems.",
        "Yes, because competitors are likely making similar investments, and falling behind in AI capabilities could result in market share losses over time.",
        "I recommend incremental AI investments with careful measurement of outcomes and customer feedback to guide future expansion of AI capabilities.",
      ],

      // AI ethical concerns for telecom marketing
      ai_ethical_concerns: [
        "Yes, definitely. AI algorithms could reinforce biases in marketing campaigns if they're trained on historically biased data, potentially discriminating against certain customer groups.",
        "Possibly. There's a fine line between personalized marketing and invasive use of customer data that feels like surveillance.",
        "Yes, definitely. AI-driven pricing could potentially lead to discriminatory practices where different customers are charged differently based on factors they can't control.",
        "Yes, as AI becomes more persuasive, there are concerns about manipulative marketing tactics that could exploit psychological vulnerabilities.",
        "Possibly. The lack of transparency in how AI makes marketing decisions could lead to practices that customers would object to if they understood them.",
        "Yes, definitely. Over-reliance on AI could lead to dehumanized customer experiences when human judgment and empathy are actually needed.",
        "Yes, as AI systems making autonomous marketing decisions without proper oversight could violate company values or regulatory requirements.",
        "Possibly. There's risk of creating filter bubbles where customers only see marketing for products similar to what they've purchased before, limiting discovery.",
        "Yes, definitely. The collection of vast amounts of data to power AI marketing raises serious privacy concerns, especially with the increasing sophistication of data analysis.",
        "Yes, as marketing AI could potentially target vulnerable populations or exploit addiction-forming behaviors if not properly governed.",
        "Possibly. There could be issues of informed consent when customers don't fully understand how their data is being used to market to them.",
        "Yes, definitely. AI systems might prioritize short-term sales over long-term customer relationships and ethical considerations.",
        "Yes, as AI marketing might create unrealistic expectations about products or services that human representatives then have to manage.",
        "Possibly. There's a risk of creating a 'black box' where even the company doesn't understand why the AI is making certain marketing decisions.",
        "Yes, definitely. The potential for AI to mimic human communication so effectively could blur the lines between human and automated interactions in deceptive ways.",
      ],

      // General comments about the survey
      general_comments: [
        "This survey effectively covered the key aspects of AI in telecom marketing from a customer perspective.",
        "I appreciate FPT Telecom's interest in gathering customer feedback about AI implementation in their services.",
        "The questions were thought-provoking and made me consider how AI is already affecting my telecom experience.",
        "I hope the feedback from this survey leads to meaningful improvements in how FPT Telecom uses AI.",
        "The survey had a good balance of questions about benefits and concerns regarding AI in telecom.",
        "I found this survey well-structured and comprehensive in addressing the various aspects of AI in telecom services.",
        "Thank you for the opportunity to share my thoughts about how AI can improve telecom services.",
        "This survey shows FPT Telecom is taking a customer-centric approach to implementing AI technologies.",
        "I appreciate companies that seek customer input before making major technological changes to their services.",
        "The questions were clear and relevant to my experiences as a telecom customer interacting with AI systems.",
      ],
    };

    // Initialize or retrieve state from GM storage
    const formState = {
      originalFormURL: window.location.href,
      startTime: GM_getValue("startTime") || new Date().toISOString(),
      totalIterations: GM_getValue("totalIterations") || 100, // Default - can be changed
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
        // Use htmlFor instead of "for" since "for" is a reserved keyword in JavaScript
        if (key === "for" && tag.toLowerCase() === "label") {
          element.htmlFor = value;
        } else {
          element.setAttribute(key, value);
        }
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

    // Create a status display element using DOM API (no innerHTML)
    function createStatusDisplay() {
      // ... existing code ...
    }

    // Update the status display
    function updateStatus(message) {
      // ... existing code ...
    }

    // Update progress display - replace innerHTML with DOM API
    function updateProgressDisplay() {
      // ... existing code ...
    }

    // Helper function to get a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Helper function to safely get a random answer from a category
    function safeGetRandomAnswer(category, source = shortAnswers) {
      try {
        const answers = source[category];
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
          console.warn(
            `Category ${category} is missing or empty, using general_comments fallback`
          );
          return shortAnswers.general_comments[
            getRandomInt(0, shortAnswers.general_comments.length - 1)
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

    // Get appropriate short answer based on question content
    function getAppropriateShortAnswer(questionText) {
      console.log(`Selecting answer for question: "${questionText}"`);

      if (!questionText) {
        return ""; // Return empty for no question text
      }

      // Convert to lowercase for case-insensitive matching
      const text = questionText.toLowerCase();

      // Customer FPT Telecom AI Survey specific questions
      if (
        text.includes("how do you think ai benefits you") ||
        text.includes("ai benefits") ||
        text.includes("benefits you as a customer")
      ) {
        console.log("Matched AI customer benefits question");
        return safeGetRandomAnswer("customer_ai_benefits");
      }

      if (
        (text.includes("how can") && text.includes("improve")) ||
        (text.includes("suggestions") && text.includes("improve")) ||
        (text.includes("suggestions for") && text.includes("ai"))
      ) {
        console.log("Matched AI improvement suggestions question");
        return safeGetRandomAnswer("ai_improvement_suggestions");
      }

      if (
        text.includes("ai features") ||
        text.includes("services would you like to see") ||
        text.includes("implement in the future")
      ) {
        console.log("Matched future AI features question");
        return safeGetRandomAnswer("future_ai_features");
      }

      if (
        text.includes("would you recommend") ||
        text.includes("invest more in ai") ||
        text.includes("why or why not")
      ) {
        console.log("Matched AI investment question");
        return safeGetRandomAnswer("ai_investment_reasons");
      }

      if (
        text.includes("ethical challenges") ||
        text.includes("ethical concerns") ||
        text.includes("create ethical")
      ) {
        console.log("Matched AI ethical concerns question");
        return safeGetRandomAnswer("ai_ethical_concerns");
      }

      // Check for general categories if no specific question matches
      if (text.includes("occupation")) {
        return [
          "Student",
          "Marketing Professional",
          "IT Specialist",
          "Business Analyst",
          "Manager",
          "Engineer",
        ][getRandomInt(0, 5)];
      } else if (text.includes("age")) {
        return ["25 to 40", "18 to 25", "over 40"][getRandomInt(0, 2)];
      } else if (text.includes("name") && text.length < 30) {
        return safeGetRandomAnswer("name");
      } else if (text.includes("email")) {
        return safeGetRandomAnswer("email");
      } else if (text.includes("comment") || text.includes("anything else")) {
        return safeGetRandomAnswer("general_comments");
      }

      // For any text fields that don't match specific patterns, use general comments
      console.log("No specific match for question, using general comment");
      return safeGetRandomAnswer("general_comments");
    }

    // Enhanced function to extract specific question text from custom forms
    function extractQuestionText(container) {
      // Try to find a direct label element for this question
      const labelSelectors = [
        "label",
        ".freebirdFormviewerComponentsQuestionBaseTitle",
        ".exportItemTitle",
        ".freebirdFormviewerComponentsQuestionTextRoot",
        ".freebirdFormviewerComponentsQuestionBaseHeader span",
        "[role='heading']",
        ".freebirdFormviewerComponentsQuestionBaseRequiredAsterisk",
        ".docssharedWizQuestionText",
        ".freebirdFormviewerComponentsQuestionTextQuestion",
      ];

      let textElement = null;
      let questionText = "";

      // Attempt to find any label or title element
      for (const selector of labelSelectors) {
        const elements = container.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          for (let i = 0; i < elements.length; i++) {
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
              textElement = element;
              questionText = text;
              console.log(`Using question text: "${questionText}"`);
              return questionText;
            }
          }
        }
      }

      // Second attempt: Try to find any spans with substantial text
      if (!textElement) {
        const spans = container.querySelectorAll("span");
        const textCandidates = Array.from(spans)
          .map((span) => ({
            element: span,
            text: span.textContent.trim(),
          }))
          .filter((item) => item.text.length > 15)
          .sort((a, b) => b.text.length - a.text.length);

        if (textCandidates.length > 0) {
          textElement = textCandidates[0].element;
          questionText = textCandidates[0].text;
          return questionText;
        }
      }

      // Third attempt: Look for div elements with text
      if (!textElement) {
        const divs = container.querySelectorAll("div");
        const textCandidates = Array.from(divs)
          .filter((div) => div.childElementCount <= 2)
          .map((div) => ({
            element: div,
            text: div.textContent.trim(),
          }))
          .filter((item) => item.text.length > 10 && item.text.length < 200)
          .sort((a, b) => b.text.length - a.text.length);

        if (textCandidates.length > 0) {
          textElement = textCandidates[0].element;
          questionText = textCandidates[0].text;
          return questionText;
        }
      }

      // If we reach here and still don't have text, find any element with visible text
      if (!textElement) {
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
            return questionText;
          }
        }
      }

      return `Question (no text found)`;
    }

    // Updated function to analyze form structure with more robust detection
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
        const questionText = extractQuestionText(container);
        console.log(`Question ${index + 1} text: "${questionText}"`);

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
            let label = option.textContent.trim();

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
            let label = option.textContent.trim();

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

        for (const questionInfo of questions) {
          console.log(
            `Processing question ${questionInfo.index}: ${questionInfo.text}`
          );

          if (questionInfo.type === "radio") {
            if (questionInfo.options && questionInfo.options.length > 0) {
              const randomIndex = getRandomInt(
                0,
                questionInfo.options.length - 1
              );
              const selectedOption = questionInfo.options[randomIndex];

              selectedOption.element.click();
              console.log(`Selected radio option: ${selectedOption.text}`);

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
                    textField.value = "Additional information";
                    textField.dispatchEvent(
                      new Event("input", { bubbles: true })
                    );
                  }
                }
              }
            }
          } else if (questionInfo.type === "checkbox") {
            if (questionInfo.options && questionInfo.options.length > 0) {
              const numToCheck = Math.min(
                getRandomInt(1, 3),
                questionInfo.options.length
              );
              const selectedIndices = [];

              while (selectedIndices.length < numToCheck) {
                const randomIndex = getRandomInt(
                  0,
                  questionInfo.options.length - 1
                );
                if (!selectedIndices.includes(randomIndex)) {
                  selectedIndices.push(randomIndex);
                }
              }

              for (const index of selectedIndices) {
                const selectedOption = questionInfo.options[index];
                selectedOption.element.click();
                console.log(`Selected checkbox option: ${selectedOption.text}`);

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
            if (questionInfo.shortAnswerInput) {
              const textValue = getAppropriateShortAnswer(questionInfo.text);
              questionInfo.shortAnswerInput.value = textValue;
              questionInfo.shortAnswerInput.dispatchEvent(
                new Event("input", { bubbles: true })
              );
              console.log(`Filled short answer with: ${textValue}`);
            }
          } else if (questionInfo.type === "text") {
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
          );

          if (options.length > 0) {
            const randomIndex = getRandomInt(0, options.length - 1);
            dropdown.selectedIndex = randomIndex + 1;

            dropdown.dispatchEvent(new Event("change", { bubbles: true }));
            console.log(
              `Selected dropdown option: ${options[randomIndex].textContent}`
            );
          }
        } else {
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

    async function submitForm() {
      try {
        const submitButton =
          document.querySelector('div[role="button"][jsname="OCpkoe"]') ||
          document.querySelector('div[role="button"][jsname="M2UYVd"]') ||
          document.querySelector(
            "span.appsMaterialWizButtonPaperbuttonLabel"
          ) ||
          document.querySelector('button[type="submit"]') ||
          [...document.querySelectorAll('div[role="button"]')].find(
            (el) =>
              el.textContent.trim().toLowerCase() === "submit" ||
              el.textContent.trim().toLowerCase() === "send" ||
              el.textContent.trim().toLowerCase() === "next"
          );

        if (submitButton) {
          console.log("Submit button found, clicking...");
          submitButton.click();

          await new Promise((resolve) => setTimeout(resolve, 2000));

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

    function isFormPage() {
      return (
        document.querySelectorAll(
          '[role="radio"], [role="checkbox"], textarea, input[type="text"]'
        ).length > 0 || document.querySelector("form") !== null
      );
    }

    function isConfirmationPage() {
      return Boolean(
        document.querySelector(
          ".freebirdFormviewerViewResponseConfirmationMessage"
        ) ||
          document.querySelector('a[jsname="A5KGRe"]') ||
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

    async function returnToForm() {
      try {
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

        console.log("Navigation link not found, returning to form URL...");
        window.location.href = formState.originalFormURL;
      } catch (error) {
        console.error("Error returning to form:", error);
        window.location.href = formState.originalFormURL;
      }
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

          if (isFormPage()) {
            console.log("Form appears to be loaded");
            setTimeout(resolve, 2000);
          } else if (attempts >= maxAttempts) {
            console.log("Max attempts reached waiting for form to load");
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

    function debugFormStructure() {
      console.log("--- DEBUG: Form Structure Analysis ---");

      const forms = document.querySelectorAll("form");
      console.log(`Found ${forms.length} form elements`);

      const divs = document.querySelectorAll("div");
      console.log(`Total div elements: ${divs.length}`);

      console.log(
        `Radio buttons: ${document.querySelectorAll('[role="radio"]').length}`
      );
      console.log(
        `Checkboxes: ${document.querySelectorAll('[role="checkbox"]').length}`
      );
      console.log(
        `Text inputs: ${document.querySelectorAll('input[type="text"]').length}`
      );
      console.log(`Textareas: ${document.querySelectorAll("textarea").length}`);

      console.log("--- End DEBUG Form Structure ---");
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
