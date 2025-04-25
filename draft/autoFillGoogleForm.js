// ==UserScript==
// @name         Google Forms Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills and submits Google Forms multiple times with random data
// @author       You
// @match        https://docs.google.com/forms/*
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

    // Create a status display element using DOM API (no innerHTML)
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

    // Update progress display - replace innerHTML with DOM API
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

    // Generate random text answers
    function generateRandomTextAnswer() {
      const answers = [
        "AI can enhance customer service through 24/7 automated responses and personalized interactions.",
        "AI chatbots could handle routine inquiries, freeing human agents for complex issues.",
        "Real-time data analysis by AI could help identify customer service trends and pain points.",
        "Predictive analytics can anticipate customer needs before they arise.",
        "AI can help create a unified view of customer interactions across all channels.",
        "Implement AI-driven recommendation engines for personalized service offerings.",
        "Use natural language processing to analyze customer feedback at scale.",
        "Deploy predictive analytics to anticipate customer churn and take preventive action.",
        "Create AI chatbots with deep integration to CRM and knowledge base systems.",
        "Use computer vision AI to improve product recognition in visual searches.",
      ];

      return answers[getRandomInt(0, answers.length - 1)];
    }

    // Debug function to analyze form structure and print question texts
    function debugFormStructure() {
      console.log("DEBUG: Examining complete form structure...");

      const form =
        document.querySelector("form") ||
        document.querySelector(".freebirdFormviewerViewFormForm");
      if (form) {
        console.log("Form found:", form);

        console.log("Form HTML structure:");
        console.log(form.outerHTML.substring(0, 500) + "... (truncated)");

        const possibleContainers = [
          form.querySelectorAll(".freebirdFormviewerViewItemsItemItem"),
          form.querySelectorAll(".freebirdFormviewerComponentsQuestionRoot"),
          form.querySelectorAll(".freebirdFormviewerViewNumberedItemContainer"),
          form.querySelectorAll(".m2"),
        ];

        possibleContainers.forEach((containers, index) => {
          console.log(
            `Container candidate ${index + 1}: found ${
              containers.length
            } elements`
          );
        });

        const radioButtons = form.querySelectorAll('[role="radio"]');
        console.log(`Found ${radioButtons.length} radio buttons`);

        const checkboxes = form.querySelectorAll('[role="checkbox"]');
        console.log(`Found ${checkboxes.length} checkboxes`);

        const textInputs = form.querySelectorAll(
          "textarea, input[type='text']"
        );
        console.log(`Found ${textInputs.length} text inputs`);

        const submitButtons = form.querySelectorAll(
          "div[role='button'], button"
        );
        console.log(`Found ${submitButtons.length} potential submit buttons`);

        const alternativeQuestionSelectors = [
          ".freebirdFormviewerViewNumberedItemContainer",
          ".freebirdFormviewerViewItemsPagebreakContainer",
          "div[role='listitem']",
          ".freebirdFormviewerViewItemsList > div",
        ];

        alternativeQuestionSelectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          console.log(
            `Alternative selector '${selector}': found ${elements.length} elements`
          );

          if (elements.length > 0) {
            console.log("Sample element:", elements[0]);
          }
        });
      } else {
        console.error("No form found on the page!");
      }
    }

    // Check if we're on the form page
    function isFormPage() {
      return (
        document.querySelectorAll('[role="radio"], [role="checkbox"], textarea')
          .length > 0 || document.querySelector("form") !== null
      );
    }

    // Check if we're on the confirmation page
    function isConfirmationPage() {
      const indicators = [
        document.querySelector('a[jsname="A4H7Gc"]'),
        document.querySelector(
          ".freebirdFormviewerViewResponseConfirmContentContainer"
        ),
        document.querySelector(".freebirdFormviewerViewResponseThankYouHeader"),
        document.body.textContent.includes("Your response has been recorded"),
        document.body.textContent.includes("Thank you for your response"),
        Array.from(document.querySelectorAll("a")).some((link) =>
          link.textContent.toLowerCase().includes("submit another response")
        ),
      ];

      return indicators.some((indicator) => indicator);
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
        const titleSelectors = [
          ".freebirdFormviewerComponentsQuestionBaseTitle",
          ".freebirdFormviewerComponentsQuestionText",
          ".docssharedWizQuestionText",
          ".m3 .freebirdFormviewerComponentsQuestionTextText",
          ".freebirdFormviewerComponentsQuestionBaseHeader",
          ".freebirdTranslationTranslationText",
          ".appsMaterialWizToggleRadiogroupGroupContent",
        ];

        let titleElement = null;
        for (const selector of titleSelectors) {
          titleElement = container.querySelector(selector);
          if (titleElement) break;
        }

        const questionText = titleElement
          ? titleElement.textContent.trim()
          : `Question ${index + 1} (no title found)`;
        console.log(`Question ${index + 1}: "${questionText}"`);

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
            const label = option.textContent.trim();

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
            const label = option.textContent.trim();

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

    async function fillFormWithRandomDataByIndex() {
      try {
        console.log("Starting to fill form with random data...");

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const questions = analyzeFormStructure();

        if (questions.length === 0) {
          console.error(
            "No questions found! You may need to check if the form is loaded correctly."
          );
          return false;
        }

        console.log(`Found ${questions.length} questions total`);

        for (let i = 1; i <= questions.length; i++) {
          const questionInfo = questions[i - 1];

          if (questionInfo.type === "radio") {
            fillQuestionByIndex(questions, i, null);
          } else if (questionInfo.type === "checkbox") {
            fillQuestionByIndex(questions, i, []);
          } else if (questionInfo.type === "text") {
            console.log(`Skipping text question ${i} as requested`);
            continue;
          } else if (questionInfo.type === "short_answer") {
            console.log(`Skipping short answer question ${i} as requested`);
            continue;
          } else if (questionInfo.type === "dropdown") {
            handleDropdownQuestion(questionInfo);
          } else if (questionInfo.type === "date") {
            console.log(`Skipping date question ${i}`);
            continue;
          } else if (questionInfo.type === "scale") {
            handleScaleQuestion(questionInfo);
          } else {
            console.log(`Unknown type for question ${i}, skipping`);
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        console.log("Form filled with random data successfully!");
        return true;
      } catch (error) {
        console.error(`Error filling form with random data: ${error.message}`);
        return false;
      }
    }

    function handleDropdownQuestion(questionInfo) {
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

    function handleScaleQuestion(questionInfo) {
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

    function waitForFormToLoad() {
      return new Promise((resolve) => {
        const maxAttempts = 30;
        let attempts = 0;

        const checkForm = () => {
          attempts++;
          console.log(
            `Checking if form is loaded (attempt ${attempts}/${maxAttempts})...`
          );

          const formIndicators = [
            document.querySelector(
              ".freebirdFormviewerViewNumberedItemContainer"
            ),
            document.querySelector("form"),
            document.querySelector(
              ".freebirdFormviewerViewItemsPagebreakContainer"
            ),
            document.querySelector(".freebirdFormviewerViewFormForm"),
            document.querySelector("div[role='list']"),
            document.querySelectorAll("div[role='listitem']").length > 0,
            document.querySelectorAll("div[role='radio']").length > 0,
            document.querySelectorAll("div[role='checkbox']").length > 0,
            document.querySelectorAll("textarea").length > 0,
          ];

          const formLoaded = formIndicators.some((indicator) => indicator);

          if (formLoaded) {
            console.log("Form appears to be loaded");
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

    function returnToForm() {
      return new Promise((resolve) => {
        updateStatus("Returning to form...");
        console.log("Attempting to return to the form...");

        let submitAnotherLink = null;
        const linkSelectors = [
          'a[jsname="A4H7Gc"]',
          "a.freebirdFormviewerViewResponseLinksContainer",
        ];

        for (const selector of linkSelectors) {
          const links = document.querySelectorAll(selector);
          for (const link of links) {
            if (
              link.textContent.toLowerCase().includes("submit another") ||
              link.textContent.toLowerCase().includes("gửi phản hồi khác")
            ) {
              submitAnotherLink = link;
              break;
            }
          }
          if (submitAnotherLink) break;
        }

        if (!submitAnotherLink) {
          const allLinks = Array.from(document.querySelectorAll("a"));
          submitAnotherLink = allLinks.find(
            (link) =>
              link.textContent.toLowerCase().includes("submit another") ||
              link.textContent.toLowerCase().includes("gửi phản hồi khác")
          );
        }

        if (submitAnotherLink) {
          console.log("Found 'Submit another response' link, clicking it");
          updateStatus("Found 'Submit another response' link, clicking it");

          saveState(formState);

          submitAnotherLink.click();

          setTimeout(() => {
            if (isFormPage()) {
              console.log(
                "Form loaded after clicking 'Submit another response'"
              );
              updateStatus("Form loaded successfully");
              resolve(true);
            } else {
              console.log(
                "Form did not load properly after clicking link, trying direct navigation"
              );
              updateStatus("Navigating directly to form...");
              window.location.href = formState.originalFormURL;
            }
          }, 2000);
        } else {
          console.log(
            "'Submit another response' link not found, navigating directly to form URL"
          );
          updateStatus("Navigating directly to form...");

          saveState(formState);

          window.location.href = formState.originalFormURL;
        }
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

        const fillSuccess = await fillFormWithRandomDataByIndex();

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
      } else if (isConfirmationPage()) {
        updateStatus("On confirmation page, returning to form...");
        await returnToForm();
      } else {
        updateStatus("Not on form page, attempting to navigate to form...");
        window.location.href = formState.originalFormURL;
      }
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
