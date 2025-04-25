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

    // Updated function to analyze form structure with multiple selector attempts
    function analyzeFormStructure() {
      console.log("Analyzing form structure...");

      const selectors = [
        ".freebirdFormviewerViewItemsItemItem",
        ".freebirdFormviewerViewNumberedItemContainer",
        ".freebirdFormviewerComponentsQuestionRoot",
        "div[role='listitem']",
        ".freebirdFormviewerViewItemsList > div",
        ".m2",
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
        };

        // Check if this is a short answer input field - new detection for short answer fields
        const shortAnswerInputs =
          container.querySelectorAll('input[type="text"]');
        const textInputs = container.querySelectorAll(
          "input.quantumWizTextinputPaperinputInput, input.exportInput"
        );

        // If any text inputs are found, mark this question as having a short answer field
        if (shortAnswerInputs.length > 0 || textInputs.length > 0) {
          questionInfo.type = "short_answer";
          questionInfo.hasShortAnswerField = true;
          questionInfo.shortAnswerInput = shortAnswerInputs[0] || textInputs[0];
          console.log(`  Type: Short answer question`);
        }

        const radioOptions = container.querySelectorAll('[role="radio"]');
        if (radioOptions.length > 0) {
          console.log(
            `  Type: Radio question with ${radioOptions.length} options`
          );
          questionInfo.type = "radio";
          questionInfo.options = [];

          // Process each radio option to detect if it has a text field ("Other" option)
          radioOptions.forEach((option, i) => {
            const label = option.textContent.trim();

            // Check if this option has a text input field (usually "Other" option)
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

        const checkboxOptions = container.querySelectorAll('[role="checkbox"]');
        if (checkboxOptions.length > 0) {
          console.log(
            `  Type: Checkbox question with ${checkboxOptions.length} options`
          );
          questionInfo.type = "checkbox";
          questionInfo.options = [];

          // Process each checkbox option to detect if it has a text field ("Other" option)
          checkboxOptions.forEach((option, i) => {
            const label = option.textContent.trim();

            // Check if this option has a text input field (usually "Other" option)
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

        const textAreaInput = container.querySelector("textarea");
        if (textAreaInput) {
          console.log(`  Type: Text input question (paragraph)`);
          questionInfo.type = "text";
          questionInfo.input = textAreaInput;
        }

        analyzedQuestions.push(questionInfo);
      });

      console.log("Form analysis complete.");
      return analyzedQuestions;
    }

    // Updated function to find and fill questions using the analysis results
    function fillQuestionByIndex(questions, questionIndex, optionIndexOrText) {
      try {
        if (questionIndex < 1 || questionIndex > questions.length) {
          console.error(`Question index out of range: ${questionIndex}`);
          return false;
        }

        const questionInfo = questions[questionIndex - 1];

        // Skip short answer questions as requested
        if (questionInfo.type === "short_answer") {
          console.log(
            `Skipping short answer question ${questionIndex} as requested`
          );
          return true;
        }

        if (questionInfo.type === "radio") {
          if (typeof optionIndexOrText === "number") {
            // Filter out options with text fields (usually "Other" option)
            const validOptions = questionInfo.options
              .filter(
                (option) =>
                  !option.hasTextField &&
                  !option.text.includes("Mục khác") && // Skip "Mục khác" (Other in Vietnamese)
                  !option.text.includes("Other") // Skip "Other" in English
              )
              .map((_, index) => index);

            if (validOptions.length === 0) {
              console.log(
                `No valid radio options without text fields found for question ${questionIndex}, selecting a non-Other option`
              );
              // If no options without text fields exist, select first option as fallback
              if (questionInfo.options.length > 0) {
                questionInfo.options[0].element.click();
              }
              return true;
            }

            // Select a random valid option
            const randomOptionIndex =
              validOptions[getRandomInt(0, validOptions.length - 1)];
            questionInfo.options[randomOptionIndex].element.click();
            console.log(
              `Selected radio option ${
                randomOptionIndex + 1
              } for question ${questionIndex}`
            );
            return true;
          } else if (typeof optionIndexOrText === "string") {
            for (let i = 0; i < questionInfo.options.length; i++) {
              // Skip options with text fields (usually "Other" option)
              if (
                questionInfo.options[i].hasTextField ||
                questionInfo.options[i].text.includes("Mục khác") ||
                questionInfo.options[i].text.includes("Other")
              )
                continue;

              if (questionInfo.options[i].text.includes(optionIndexOrText)) {
                questionInfo.options[i].element.click();
                console.log(
                  `Selected radio option "${optionIndexOrText}" for question ${questionIndex}`
                );
                return true;
              }
            }
            console.error(
              `Radio option text not found: "${optionIndexOrText}"`
            );
            return false;
          } else {
            // If no specific option provided, select a random valid option
            const validOptions = questionInfo.options
              .filter(
                (option) =>
                  !option.hasTextField &&
                  !option.text.includes("Mục khác") &&
                  !option.text.includes("Other")
              )
              .map((_, index) => index);

            if (validOptions.length === 0) {
              if (questionInfo.options.length > 0) {
                questionInfo.options[0].element.click();
              }
              return true;
            }

            const randomOptionIndex =
              validOptions[getRandomInt(0, validOptions.length - 1)];
            questionInfo.options[randomOptionIndex].element.click();
            console.log(
              `Selected random radio option ${
                randomOptionIndex + 1
              } for question ${questionIndex}`
            );
            return true;
          }
        } else if (questionInfo.type === "checkbox") {
          if (Array.isArray(optionIndexOrText)) {
            let success = false;

            // Filter out options with text fields (usually "Other" option)
            const validOptions = questionInfo.options
              .filter(
                (option) =>
                  !option.hasTextField &&
                  !option.text.includes("Mục khác") && // Skip "Mục khác" (Other in Vietnamese)
                  !option.text.includes("Other") // Skip "Other" in English
              )
              .map((_, index) => index);

            if (validOptions.length === 0) {
              console.log(
                `No valid checkbox options without text fields found for question ${questionIndex}, selecting a non-Other option`
              );
              // If no options without text fields exist, select first option as fallback
              if (questionInfo.options.length > 0) {
                questionInfo.options[0].element.click();
                return true;
              }
              return false;
            }

            // Select 1-3 random valid options
            const numToSelect = Math.min(
              getRandomInt(1, 3),
              validOptions.length
            );
            const selectedOptions = getRandomElements(
              validOptions,
              numToSelect
            );

            for (const optionIndex of selectedOptions) {
              questionInfo.options[optionIndex].element.click();
              console.log(
                `Selected checkbox option ${
                  optionIndex + 1
                } for question ${questionIndex}`
              );
              success = true;
            }

            return success;
          } else {
            // If no specific options provided, select random valid options
            const validOptions = questionInfo.options
              .filter(
                (option) =>
                  !option.hasTextField &&
                  !option.text.includes("Mục khác") &&
                  !option.text.includes("Other")
              )
              .map((_, index) => index);

            if (validOptions.length === 0) {
              if (questionInfo.options.length > 0) {
                questionInfo.options[0].element.click();
                return true;
              }
              return false;
            }

            const numToSelect = Math.min(
              getRandomInt(1, 3),
              validOptions.length
            );
            const selectedOptions = getRandomElements(
              validOptions,
              numToSelect
            );

            for (const optionIndex of selectedOptions) {
              questionInfo.options[optionIndex].element.click();
              console.log(
                `Selected checkbox option ${
                  optionIndex + 1
                } for question ${questionIndex}`
              );
            }

            return true;
          }
        } else if (questionInfo.type === "text") {
          const textInput = questionInfo.input;
          textInput.value = optionIndexOrText;
          textInput.dispatchEvent(new Event("input", { bubbles: true }));
          textInput.dispatchEvent(new Event("change", { bubbles: true }));
          console.log(
            `Filled text for question ${questionIndex} with "${optionIndexOrText.substring(
              0,
              20
            )}..."`
          );
          return true;
        } else {
          console.error(`Unknown question type for question ${questionIndex}`);
          return false;
        }
      } catch (error) {
        console.error(`Error in fillQuestionByIndex: ${error.message}`);
        return false;
      }
    }

    // Updated function to fill form with random data using analyzed question structure
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
            // Pass null to let fillQuestionByIndex handle selecting non-Other options
            fillQuestionByIndex(questions, i, null);
          } else if (questionInfo.type === "checkbox") {
            // Pass empty array to let fillQuestionByIndex handle selecting non-Other options
            fillQuestionByIndex(questions, i, []);
          } else if (questionInfo.type === "text") {
            fillQuestionByIndex(questions, i, generateRandomTextAnswer());
          } else if (questionInfo.type === "short_answer") {
            console.log(`Skipping short answer question ${i} as requested`);
            continue;
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

    // Helper function to submit the form - with additional debugging
    function submitForm() {
      try {
        console.log("Looking for submit button...");

        const submitSelectors = [
          '[type="submit"]',
          ".freebirdFormviewerViewNavigationSubmitButton",
          ".appsMaterialWizButtonPaperbuttonLabel",
          ".freebirdFormviewerViewNavigationNoSubmitButton",
          'div[role="button"][jsname="M2UYVd"]',
          ".freebirdFormviewerViewNavigationButtons div[role='button']",
          'div[jscontroller="VXdfxd"]',
          ".freebirdFormviewerViewNavigationLeftButtons .appsMaterialWizButtonPaperbuttonFocused",
          ".freebirdFormviewerViewNavigationSubmitButton.appsMaterialWizButtonPaperbuttonEl",
        ];

        for (const selector of submitSelectors) {
          const buttons = document.querySelectorAll(selector);
          console.log(
            `Found ${buttons.length} elements with selector: ${selector}`
          );

          for (const button of buttons) {
            console.log(
              `Examining button: "${button.textContent.trim()}", visible: ${
                button.offsetParent !== null
              }`
            );

            if (
              (button.textContent.includes("Submit") ||
                button.textContent.includes("Gửi") ||
                button.getAttribute("data-mdc-dialog-action") === "ok") &&
              button.offsetParent !== null
            ) {
              console.log(
                `Clicking submit button: "${button.textContent.trim()}"`
              );
              button.click();
              console.log("Form submitted!");

              return new Promise((resolve) => {
                let attempts = 0;
                const checkConfirmation = () => {
                  attempts++;
                  if (isConfirmationPage()) {
                    console.log("Detected confirmation page!");
                    resolve(true);
                  } else if (attempts >= 20) {
                    console.log("Timed out waiting for confirmation page");
                    resolve(false);
                  } else {
                    setTimeout(checkConfirmation, 500);
                  }
                };
                setTimeout(checkConfirmation, 1000);
              });
            }
          }
        }

        const allButtons = document.querySelectorAll(
          "div[role='button'], button"
        );
        console.log(`Found ${allButtons.length} total buttons`);

        for (const button of allButtons) {
          if (button.offsetParent !== null) {
            const buttonRect = button.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (buttonRect.top > viewportHeight / 2) {
              console.log(
                `Trying visible button at bottom: "${button.textContent.trim()}"`
              );
              button.click();
              console.log("Clicked a button that might be submit!");
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(isConfirmationPage());
                }, 2000);
              });
            }
          }
        }

        const form = document.querySelector("form");
        if (form) {
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          form.dispatchEvent(submitEvent);
          console.log("Form submitted via event!");
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(isConfirmationPage());
            }, 2000);
          });
        }

        console.error("Submit button not found - printing form details");
        debugFormStructure();
        return Promise.resolve(false);
      } catch (error) {
        console.error(`Error in submitForm: ${error.message}`);
        return Promise.resolve(false);
      }
    }

    // Improved function to wait for form to load with multiple detection methods
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

    // Enhanced function to return to the form after submission
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

          // Save state before clicking in case of page reload
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
              // The script will be reloaded when the page reloads
            }
          }, 2000);
        } else {
          console.log(
            "'Submit another response' link not found, navigating directly to form URL"
          );
          updateStatus("Navigating directly to form...");

          // Save state before navigation
          saveState(formState);

          window.location.href = formState.originalFormURL;
          // The script will be reloaded when the page reloads
        }
      });
    }

    // Main function to run the automated form filling process
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

        // Wait and try to recover
        setTimeout(async () => {
          await returnToForm();
        }, 3000);
      }
    }

    // Function to check conditions and continue autofill if appropriate
    async function continueAutofill() {
      // Check if paused
      if (window.autoFillPaused || GM_getValue("paused") === true) {
        window.autoFillPaused = true;
        updateStatus("Paused");
        return;
      }

      // Check if we've reached the desired number of iterations
      if (formState.currentIteration >= formState.totalIterations) {
        updateStatus(
          `All done! Completed ${formState.totalIterations} submissions.`
        );
        return;
      }

      // Check if we're on the form page
      if (isFormPage()) {
        await fillOneIteration();
      }
      // Check if we're on the confirmation page
      else if (isConfirmationPage()) {
        updateStatus("On confirmation page, returning to form...");
        await returnToForm();
      }
      // If neither, we might be on an unexpected page
      else {
        updateStatus("Not on form page, attempting to navigate to form...");
        window.location.href = formState.originalFormURL;
      }
    }

    // Main entry point - creates UI and starts the process
    function initAutofill() {
      // Create the status display
      createStatusDisplay();

      // Initialize pause state
      window.autoFillPaused = GM_getValue("paused") === true;

      if (window.autoFillPaused) {
        updateStatus("Paused - click Resume to continue");
      } else {
        updateStatus("Starting...");
      }

      // Update progress display
      updateProgressDisplay();

      // Start the process if not paused
      if (!window.autoFillPaused) {
        setTimeout(() => {
          continueAutofill();
        }, 1000);
      }
    }

    // Call the initialization function
    initAutofill();
  }
})();
