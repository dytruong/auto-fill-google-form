// ==UserScript==
// @name         Google Forms Auto-Fill - Custom Form
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically fills and submits the specified Google Form multiple times with random data (skipping short answer questions)
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
    setTimeout(initScript, 3000); // Increased initial delay to 3000ms
  });

  function initScript() {
    console.log("Google Forms Auto-Fill: Script initialized for specific form");

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

    // Helper function to find associated label for an input
    function findAssociatedLabel(inputElement) {
      // First try to find a label with matching 'for' attribute
      if (inputElement.id) {
        const label = document.querySelector(`label[for="${inputElement.id}"]`);
        if (label) return label;
      }

      // Then check if the input is inside a label element
      let parent = inputElement.parentNode;
      while (parent && parent !== document) {
        if (parent.tagName === "LABEL") {
          return parent;
        }
        parent = parent.parentNode;
      }

      // Try to find a general associated text
      parent = inputElement.parentNode;
      if (parent) {
        // Look for text nodes or elements that might contain text
        const possibleLabels = Array.from(parent.childNodes).filter(
          (node) =>
            (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) ||
            (node.nodeType === Node.ELEMENT_NODE &&
              node !== inputElement &&
              node.textContent.trim())
        );

        if (possibleLabels.length > 0) {
          return possibleLabels[0];
        }
      }

      return null;
    }

    // Check if we're on the form page - Enhanced to detect more form elements
    function isFormPage() {
      // Check for more form elements and log what we find
      const formElementCounts = {
        radio: document.querySelectorAll('[role="radio"]').length,
        checkbox: document.querySelectorAll('[role="checkbox"]').length,
        textfields: document.querySelectorAll('input[type="text"], textarea')
          .length,
        formContainer: document.querySelectorAll(
          ".freebirdFormviewerViewFormCard"
        ).length,
        questionContainers: document.querySelectorAll(
          ".freebirdFormviewerViewNumberedItemContainer, .freebirdFormviewerViewItemsItemItem"
        ).length,
        formForm: document.querySelectorAll(
          ".freebirdFormviewerViewFormForm, form"
        ).length,
        listItems: document.querySelectorAll('div[role="listitem"]').length,
        materialRadios: document.querySelectorAll(
          ".appsMaterialWizToggleRadiogroupEl"
        ).length,
        materialCheckboxes: document.querySelectorAll(
          ".appsMaterialWizToggleCheckboxEl"
        ).length,
      };

      console.log("Form element counts:", formElementCounts);

      const hasFormElements = Object.values(formElementCounts).some(
        (count) => count > 0
      );
      console.log("Is form page:", hasFormElements);

      return hasFormElements;
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

    // Debug form structure to help identify issues
    function debugFormStructure() {
      console.log("=== DEBUG FORM STRUCTURE START ===");
      console.log("Document title:", document.title);
      console.log("Current URL:", window.location.href);

      // Log all question containers
      const questionContainers = document.querySelectorAll(
        ".freebirdFormviewerViewNumberedItemContainer, .freebirdFormviewerViewItemsItemItem"
      );
      console.log(
        `Found ${questionContainers.length} question containers using primary selectors`
      );

      // Try alternative selectors
      const alternativeContainers = document.querySelectorAll(
        '.freebirdFormviewerComponentsQuestionBaseRoot, [role="listitem"], .freebirdThemedMaterialRadiogroupEl'
      );
      console.log(
        `Found ${alternativeContainers.length} question containers using alternative selectors`
      );

      // Log form elements
      console.log(
        "Radio buttons:",
        document.querySelectorAll('[role="radio"]').length
      );
      console.log(
        "Checkboxes:",
        document.querySelectorAll('[role="checkbox"]').length
      );
      console.log(
        "Text inputs:",
        document.querySelectorAll('input[type="text"]').length
      );
      console.log("Textareas:", document.querySelectorAll("textarea").length);
      console.log(
        "Select elements:",
        document.querySelectorAll("select").length
      );

      // Look for Material Design elements specifically
      console.log(
        "Material Design radios:",
        document.querySelectorAll(
          ".appsMaterialWizToggleRadiogroupEl, .quantumWizTogglePaperradioEl"
        ).length
      );
      console.log(
        "Material Design checkboxes:",
        document.querySelectorAll(
          ".appsMaterialWizToggleCheckboxEl, .quantumWizTogglePapercheckboxEl"
        ).length
      );

      // Log all visible form-like containers
      const allContainers = Array.from(
        document.querySelectorAll(
          'div[role="list"], form, .freebirdFormviewerViewFormForm'
        )
      );
      console.log(`Found ${allContainers.length} form containers`);

      // Take a screenshot of the DOM structure for troubleshooting
      console.log(
        "Document body HTML sample:",
        document.body.innerHTML.substring(0, 1000) + "..."
      );
      console.log("=== DEBUG FORM STRUCTURE END ===");
    }

    // Enhanced function to extract form structure with better checkbox handling
    function extractFormStructure() {
      console.log("Extracting form structure...");
      debugFormStructure(); // Add debug information

      const formStructure = [];

      // Find all question containers with expanded selectors
      const primaryQuestionContainers = document.querySelectorAll(
        ".freebirdFormviewerViewNumberedItemContainer, .freebirdFormviewerViewItemsItemItem"
      );

      // Alternative selectors for Google Forms
      const alternativeContainers = document.querySelectorAll(
        '.freebirdFormviewerComponentsQuestionBaseRoot, [role="listitem"], .freebirdThemedMaterialRadiogroupEl'
      );

      console.log(
        `Found ${primaryQuestionContainers.length} primary question containers and ${alternativeContainers.length} alternative containers`
      );

      // If no questions found with primary selectors, try alternatives
      const questionContainers =
        primaryQuestionContainers.length > 0
          ? primaryQuestionContainers
          : alternativeContainers;

      if (questionContainers.length === 0) {
        console.log(
          "No question containers found! Trying more generic approach..."
        );

        // Try a more generic approach - find inputs and walk up to find containers
        const allInputs = document.querySelectorAll(
          'input, textarea, [role="radio"], [role="checkbox"]'
        );
        const uniqueContainers = new Set();

        allInputs.forEach((input) => {
          // Walk up to find a likely container
          let parent = input.parentNode;
          let steps = 0;
          while (parent && parent !== document.body && steps < 5) {
            // Look for container-like elements
            if (
              parent.matches(
                '[role="listitem"], .freebirdFormviewerComponentsQuestionBase, .freebirdMaterialHeaderbannerLabelContainer'
              )
            ) {
              uniqueContainers.add(parent);
              break;
            }
            parent = parent.parentNode;
            steps++;
          }
        });

        console.log(
          `Found ${uniqueContainers.size} container candidates from inputs`
        );

        // Convert to array and continue processing
        if (uniqueContainers.size > 0) {
          let containerArray = Array.from(uniqueContainers);
          processContainers(containerArray);
          return formStructure;
        }
      }

      // Process the containers we found
      processContainers(Array.from(questionContainers));

      function processContainers(containers) {
        containers.forEach((container, containerIndex) => {
          // Get question text
          const questionTitleElement = container.querySelector(
            ".freebirdFormviewerViewItemsItemItemTitle, .freebirdFormviewerComponentsQuestionBaseTitle, [role='heading'], .docssharedWizOmnilistItemTitle"
          );

          // Default question text if we can't find it
          let questionText = "Question " + (containerIndex + 1);

          if (questionTitleElement) {
            questionText = questionTitleElement.textContent.trim();
            console.log(
              `Processing question ${containerIndex}: "${questionText}"`
            );
          } else {
            console.log(
              `Question title not found for container ${containerIndex}, using default text`
            );
          }

          // Check if question is required
          const required =
            container.querySelector(
              ".freebirdFormviewerViewItemsItemRequiredAsterisk"
            ) !== null ||
            container.querySelector("[aria-label*='required']") !== null;

          // Get question type and specific elements
          let questionType = "unknown";
          let questionData = {};

          // Check for short answer / paragraph text
          const textInput = container.querySelector('input[type="text"]');
          const textArea = container.querySelector("textarea");

          // Check for radio buttons
          const radioInputs = container.querySelectorAll('input[type="radio"]');
          const materialRadios = container.querySelectorAll(
            ".freebirdFormviewerViewItemsRadioOptionContainer, .appsMaterialWizToggleRadiopaper, [role='radio']"
          );

          // Enhanced checkbox detection
          const checkboxInputs = container.querySelectorAll(
            'input[type="checkbox"]'
          );
          const materialCheckboxes = container.querySelectorAll(
            ".freebirdFormviewerViewItemsCheckboxOptionContainer, .quantumWizTogglePapercheckboxEl, .appsMaterialWizTogglePapercheckboxEl, .freebirdThemedCheckbox, [role='checkbox']"
          );

          // Check for dropdown
          const selectElement = container.querySelector("select");
          const materialDropdown = container.querySelector(
            ".freebirdFormviewerViewItemsSelectSelect, .quantumWizMenuPaperselectEl, [role='listbox']"
          );

          // Check for date input
          const dateInput = container.querySelector('input[type="date"]');

          // Check for scale (linear scale)
          const scaleContainer = container.querySelector(
            ".freebirdFormviewerViewItemsScaleRadioGroup, [role='radiogroup']"
          );

          // Determine question type and collect relevant elements
          if (textInput || textArea) {
            questionType = textArea ? "text" : "short_answer";
            questionData = {
              shortAnswerInput: textInput,
              textAreaInput: textArea,
              input: textInput || textArea,
            };
          } else if (radioInputs.length > 0 || materialRadios.length > 0) {
            questionType = "radio";
            const options = [];

            // Process standard radio inputs
            if (radioInputs.length > 0) {
              radioInputs.forEach((radio, i) => {
                const label = findAssociatedLabel(radio);
                if (label) {
                  options.push({
                    index: i,
                    text: label.textContent.trim(),
                    element: radio,
                  });
                }
              });
            }
            // Process Material Design radio buttons
            else if (materialRadios.length > 0) {
              materialRadios.forEach((radio, i) => {
                const labelElement =
                  radio.querySelector(".docssharedWizToggleLabeledLabelText") ||
                  radio;
                options.push({
                  index: i,
                  text: labelElement.textContent.trim() || `Option ${i + 1}`,
                  element: radio,
                });
              });
            }

            questionData = { options };
          } else if (
            checkboxInputs.length > 0 ||
            materialCheckboxes.length > 0
          ) {
            questionType = "checkbox";
            const options = [];

            // Process standard checkbox inputs
            if (checkboxInputs.length > 0) {
              checkboxInputs.forEach((checkbox, i) => {
                const label = findAssociatedLabel(checkbox);
                if (label) {
                  options.push({
                    index: i,
                    text: label.textContent.trim(),
                    element: checkbox,
                    container: checkbox.closest("div"),
                  });
                }
              });
            }
            // Process Material Design checkboxes with enhanced detection
            else if (materialCheckboxes.length > 0) {
              materialCheckboxes.forEach((checkbox, i) => {
                // Try different ways to get the label text
                let labelElement = checkbox.querySelector(
                  ".docssharedWizToggleLabeledLabelText, .quantumWizTogglePapercheckboxLabel"
                );

                // If that failed, try the parent container
                if (!labelElement || !labelElement.textContent.trim()) {
                  const parent = checkbox.closest(
                    ".freebirdFormviewerViewItemsCheckboxChoice"
                  );
                  if (parent) {
                    labelElement = parent.querySelector(
                      '[role="heading"], .docssharedWizToggleLabeledContent'
                    );
                  }
                }

                // If still no label found, use the checkbox itself as fallback
                if (!labelElement) {
                  labelElement = checkbox;
                }

                options.push({
                  index: i,
                  text: labelElement
                    ? labelElement.textContent.trim()
                    : `Option ${i + 1}`,
                  element: checkbox,
                  container: checkbox.closest("div"),
                });
              });
            }

            questionData = { options };
          } else if (selectElement || materialDropdown) {
            questionType = "dropdown";
            questionData = {
              dropdown: selectElement || materialDropdown,
            };

            // For standard select elements, collect options
            if (selectElement) {
              const options = [];
              Array.from(selectElement.options).forEach((option, i) => {
                if (i > 0) {
                  // Skip the first placeholder option
                  options.push({
                    index: i,
                    text: option.text.trim(),
                    value: option.value,
                  });
                }
              });
              questionData.options = options;
            }
          } else if (dateInput) {
            questionType = "date";
            questionData = { dateInput };
          } else if (scaleContainer) {
            questionType = "scale";
            const scaleOptions = scaleContainer.querySelectorAll(
              'input[type="radio"], .appsMaterialWizToggleRadiopaper'
            );
            questionData = {
              scaleOptions: Array.from(scaleOptions),
            };
          }

          // Create question object with all collected data
          const questionObject = {
            index: containerIndex,
            text: questionText,
            type: questionType,
            required,
            ...questionData,
          };

          console.log(`Question object created:`, questionObject);
          formStructure.push(questionObject);
        });
      }

      console.log(`Extracted ${formStructure.length} questions from form`);
      return formStructure;
    }

    // Helper function to find matching option in a list
    function findMatchingOption(options, answer) {
      // Try exact match first
      let option = options.find(
        (opt) => opt.text.toLowerCase() === answer.toLowerCase()
      );

      // If no exact match, try partial match
      if (!option) {
        option = options.find(
          (opt) =>
            opt.text.toLowerCase().includes(answer.toLowerCase()) ||
            answer.toLowerCase().includes(opt.text.toLowerCase())
        );
      }

      return option;
    }

    // Helper function to find a matching answer for a question
    function findMatchingAnswer(questionText, answers) {
      // Try to find direct match by question text
      for (const key in answers) {
        if (key.toLowerCase() === questionText.toLowerCase()) {
          return answers[key];
        }
      }

      // If no direct match, try partial match
      for (const key in answers) {
        if (
          questionText.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(questionText.toLowerCase())
        ) {
          return answers[key];
        }
      }

      return null;
    }

    // Helper function to format dates
    function formatDateForInput(dateStr) {
      try {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      } catch (e) {
        return dateStr;
      }
    }

    // Helper function to trigger events on elements
    function triggerEvent(element, eventType) {
      const event = new Event(eventType, { bubbles: true });
      element.dispatchEvent(event);
    }

    // Helper function to fill a radio question with a random option
    function fillRadioQuestion(question) {
      if (question.options && question.options.length > 0) {
        // Select a random option
        const randomIndex = getRandomInt(0, question.options.length - 1);
        const selectedOption = question.options[randomIndex];

        console.log(
          `Selecting radio option ${randomIndex}: "${selectedOption.text}"`
        );

        if (selectedOption.element.tagName === "INPUT") {
          selectedOption.element.checked = true;
          triggerEvent(selectedOption.element, "click");
        } else {
          // For material design radios, simulate a click
          selectedOption.element.click();
        }
        return true;
      }
      return false;
    }

    // Helper function to fill a checkbox question with random selections
    function fillCheckboxQuestion(question) {
      if (question.options && question.options.length > 0) {
        // Select between 1 and all options randomly
        const numToSelect = getRandomInt(
          1,
          Math.min(question.options.length, 3)
        );
        const selectedIndices = [];

        // Get unique random indices
        while (selectedIndices.length < numToSelect) {
          const idx = getRandomInt(0, question.options.length - 1);
          if (!selectedIndices.includes(idx)) {
            selectedIndices.push(idx);
          }
        }

        console.log(
          `Selecting ${numToSelect} checkbox options: ${selectedIndices.join(
            ", "
          )}`
        );

        // Check each selected option
        selectedIndices.forEach((idx) => {
          const option = question.options[idx];

          if (option.element.tagName === "INPUT") {
            option.element.checked = true;
            triggerEvent(option.element, "click");
          } else {
            // Try to find the actual checkbox element within the container
            const checkboxInput = option.element.querySelector(
              'input[type="checkbox"]'
            );
            if (checkboxInput) {
              checkboxInput.checked = true;
              triggerEvent(checkboxInput, "click");
            } else {
              // For material design checkboxes, simulate a click on the container
              option.element.click();
            }
          }

          console.log(`Checked option ${idx}: "${option.text}"`);
        });

        return true;
      }
      return false;
    }

    // Helper function to fill a dropdown question
    function handleDropdownQuestion(question) {
      if (question.dropdown) {
        // For standard select elements
        if (question.dropdown.tagName === "SELECT") {
          // Skip the first placeholder option
          const optionsCount = question.dropdown.options.length;
          if (optionsCount > 1) {
            const randomIndex = getRandomInt(1, optionsCount - 1);
            question.dropdown.selectedIndex = randomIndex;
            triggerEvent(question.dropdown, "change");
            console.log(
              `Selected dropdown option ${randomIndex}: "${question.dropdown.options[randomIndex].text}"`
            );
            return true;
          }
        }
        // For material design dropdowns
        else {
          // Click to open the dropdown
          question.dropdown.click();

          // Wait for options to appear and then select a random one
          setTimeout(() => {
            const dropdownOptions = document.querySelectorAll(
              ".exportSelectPopup .quantumWizMenuPaperselectOption"
            );

            if (dropdownOptions.length > 0) {
              const randomIndex = getRandomInt(0, dropdownOptions.length - 1);
              dropdownOptions[randomIndex].click();
              console.log(`Selected material dropdown option ${randomIndex}`);
              return true;
            }
          }, 500);
        }
      }
      return false;
    }

    // Helper function to fill a scale question
    function handleScaleQuestion(question) {
      if (question.scaleOptions && question.scaleOptions.length > 0) {
        // Select a random option
        const randomIndex = getRandomInt(0, question.scaleOptions.length - 1);
        const selectedOption = question.scaleOptions[randomIndex];

        console.log(`Selecting scale option ${randomIndex}`);

        if (selectedOption.tagName === "INPUT") {
          selectedOption.checked = true;
          triggerEvent(selectedOption, "click");
        } else {
          selectedOption.click();
        }
        return true;
      }
      return false;
    }

    // Fill a question with random data based on its type and index
    function fillQuestionByIndex(questions, index, answer) {
      const questionInfo = questions[index - 1];
      if (!questionInfo) {
        console.log(`Question at index ${index} not found`);
        return false;
      }

      console.log(
        `Filling question ${index}: ${questionInfo.text} (${questionInfo.type})`
      );

      switch (questionInfo.type) {
        case "radio":
          return fillRadioQuestion(questionInfo);

        case "checkbox":
          return fillCheckboxQuestion(questionInfo);

        case "dropdown":
          return handleDropdownQuestion(questionInfo);

        case "scale":
          return handleScaleQuestion(questionInfo);

        case "short_answer":
        case "text":
          // Skip text inputs as requested
          console.log(`Skipping ${questionInfo.type} question as requested`);
          return true;

        default:
          console.log(`Unknown question type: ${questionInfo.type}`);
          return false;
      }
    }

    async function fillFormWithRandomDataByIndex() {
      try {
        console.log("Starting to fill form with random data...");

        // Give time for any dynamic content to fully load
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const questions = extractFormStructure();

        if (!questions || questions.length === 0) {
          console.error(
            "No questions found! You may need to check if the form is loaded correctly."
          );
          debugFormStructure(); // Extra debugging on failure
          return false;
        }

        console.log(`Found ${questions.length} questions total`);

        for (let i = 1; i <= questions.length; i++) {
          const questionInfo = questions[i - 1];

          if (questionInfo.type === "radio") {
            fillRadioQuestion(questionInfo);
          } else if (questionInfo.type === "checkbox") {
            fillCheckboxQuestion(questionInfo);
          } else if (
            questionInfo.type === "text" ||
            questionInfo.type === "short_answer"
          ) {
            console.log(
              `Skipping ${questionInfo.type} question ${i} as requested`
            );
            continue;
          } else if (questionInfo.type === "dropdown") {
            handleDropdownQuestion(questionInfo);
          } else if (questionInfo.type === "date") {
            console.log(`Skipping date question ${i}`);
            continue;
          } else if (questionInfo.type === "scale") {
            handleScaleQuestion(questionInfo);
          } else {
            console.log(
              `Unknown type for question ${i}: ${questionInfo.type}, skipping`
            );
          }

          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        console.log("Form filled with random data successfully!");
        return true;
      } catch (error) {
        console.error(`Error filling form with random data: ${error.message}`);
        console.error(error.stack);
        return false;
      }
    }

    // Submit the form
    async function submitForm() {
      try {
        console.log("Attempting to submit form...");

        // Debug all potential submit buttons
        console.log("=== DEBUG SUBMIT BUTTONS START ===");

        // Log all buttons or elements that might be submit buttons
        const allButtons = document.querySelectorAll(
          'div[role="button"], button, .appsMaterialWizButtonEl, .appsMaterialWizButtonPaperbuttonEl'
        );
        console.log(`Found ${allButtons.length} potential button elements`);

        // Log details about each button
        Array.from(allButtons).forEach((btn, i) => {
          console.log(
            `Button ${i}: Text="${btn.textContent.trim()}", Classes="${
              btn.className
            }", Role="${btn.getAttribute("role")}"`
          );
        });

        // Log navigation container
        const navContainer = document.querySelector(
          ".freebirdFormviewerViewNavigationButtons, .freebirdFormviewerViewNavigationLeftButtons, .freebirdFormviewerViewNavigationRightButtons"
        );
        if (navContainer) {
          console.log("Navigation container found:", navContainer.className);
          console.log(
            "Navigation container children:",
            navContainer.children.length
          );
        } else {
          console.log("No standard navigation container found");
        }

        console.log("=== DEBUG SUBMIT BUTTONS END ===");

        // Try to find the submit button with various selectors (expanded list)
        const submitButtonSelectors = [
          ".freebirdFormviewerViewNavigationSubmitButton",
          '.freebirdFormviewerViewNavigationButtons div[role="button"]',
          ".freebirdFormviewerViewNavigationNoSubmitButton",
          'div[role="button"]:not(.freebirdFormviewerViewItemsPagebreakButton)',
          ".appsMaterialWizButtonEl",
          'div[jsname="M2UYVd"]',
          ".freebirdThemedFilledButtonM2",
          ".quantumWizButtonPaperbuttonEl",
          ".appsMaterialWizButtonPaperbuttonEl",
          ".freebirdFormviewerViewNavigationNavControls",
          // New selectors based on modern Google Forms
          ".freebirdFormviewerViewNavigationButtons button",
          'button[type="submit"]',
          ".freebirdFormviewerViewNavigationRightButtons .freebirdThemedFilledButtonM2",
          'div[data-last-entry="true"] div[role="button"]',
        ];

        let submitButton = null;

        // First try with exact text matching for submit button
        for (const selector of submitButtonSelectors) {
          const buttons = document.querySelectorAll(selector);
          console.log(`Selector "${selector}" found ${buttons.length} buttons`);

          for (const button of buttons) {
            const buttonText = button.textContent.toLowerCase();
            if (
              buttonText.includes("submit") ||
              buttonText.includes("gửi") ||
              buttonText.includes("send") ||
              buttonText.includes("next") ||
              buttonText.includes("tiếp theo") ||
              buttonText.includes("done") ||
              buttonText.includes("finish") ||
              buttonText.includes("complete") ||
              buttonText === "" // Some submit buttons might have no text
            ) {
              submitButton = button;
              console.log("Submit button found with selector:", selector);
              console.log("Button text:", buttonText);
              break;
            }
          }
          if (submitButton) break;
        }

        // If still not found, try the last button in navigation area
        if (!submitButton) {
          const navButtons = document.querySelectorAll(
            '.freebirdFormviewerViewNavigationButtons div[role="button"], .freebirdFormviewerViewNavigationRightButtons div[role="button"]'
          );
          if (navButtons && navButtons.length > 0) {
            // Try the last button, which is usually submit
            submitButton = navButtons[navButtons.length - 1];
            console.log(
              "Using last navigation button as submit button:",
              submitButton.textContent
            );
          }
        }

        // If still not found, try any button at the bottom of the form
        if (!submitButton) {
          // Find the form container first
          const formContainer = document.querySelector(
            ".freebirdFormviewerViewFormCard"
          );
          if (formContainer) {
            // Get all buttons within the form and take the last one
            const formButtons = formContainer.querySelectorAll(
              'div[role="button"], button'
            );
            if (formButtons && formButtons.length > 0) {
              submitButton = formButtons[formButtons.length - 1];
              console.log(
                "Using last form button as submit button:",
                submitButton.textContent
              );
            }
          }
        }

        // Last resort: try ANY button elements
        if (!submitButton) {
          // Try one more general approach - any button-like element
          const allPossibleButtons = Array.from(
            document.querySelectorAll(
              'div[role="button"], button, .appsMaterialWizButtonEl, .appsMaterialWizButtonPaperbuttonEl'
            )
          );

          // Try to filter by position - buttons at the bottom are likely submit buttons
          const sortedByPosition = allPossibleButtons.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectB.bottom - rectA.bottom; // Sort by bottom position (higher value = lower on page)
          });

          // Take the bottom-most button that's not a cancel button
          for (const button of sortedByPosition) {
            if (!button.textContent.toLowerCase().includes("cancel")) {
              submitButton = button;
              console.log(
                "Using bottom-most button as submit button:",
                button.textContent
              );
              break;
            }
          }
        }

        if (submitButton) {
          console.log(
            "Submit button found:",
            submitButton.textContent || "[No text]"
          );
          console.log("Submit button classes:", submitButton.className);

          // Try clicking the button
          submitButton.click();
          console.log("Button clicked");

          // Wait for form submission to complete
          await new Promise((resolve) => setTimeout(resolve, 4000)); // Increased wait time to 4 seconds

          // Check if we're on the confirmation page
          if (isConfirmationPage()) {
            console.log("Successfully submitted form!");
            return true;
          } else {
            console.log(
              "Form may not have been submitted successfully. Checking form state..."
            );

            // Check if form elements are still visible
            if (isFormPage()) {
              console.log("Still on form page. Trying alternative approach...");

              // Try to click again with a different method
              try {
                const clickEvent = new MouseEvent("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                });
                submitButton.dispatchEvent(clickEvent);
                console.log("Dispatched click event");

                // Wait again
                await new Promise((resolve) => setTimeout(resolve, 3000));

                if (isConfirmationPage()) {
                  console.log("Second attempt successful!");
                  return true;
                } else {
                  console.log(
                    "Second attempt failed. Form might be blocked by validation."
                  );
                  return false;
                }
              } catch (e) {
                console.error("Error in second click attempt:", e);
                return false;
              }
            } else {
              // We're not on the form page but also not on confirmation page
              // This could be transitional state or different success page
              console.log(
                "No longer on form page. Assuming submission worked."
              );
              return true;
            }
          }
        } else {
          console.error(
            "Could not find submit button - adding detailed debug info"
          );

          // Add more detailed debugging
          const allElements = Array.from(document.querySelectorAll("*"));
          const buttonLike = allElements.filter(
            (el) =>
              el.tagName === "BUTTON" ||
              el.getAttribute("role") === "button" ||
              el.className.includes("button") ||
              (el.textContent &&
                ["submit", "gửi", "send", "next", "done"].some((text) =>
                  el.textContent.toLowerCase().includes(text)
                ))
          );

          console.log("Found " + buttonLike.length + " button-like elements:");
          buttonLike.forEach((el, i) => {
            if (i < 20) {
              // Limit to prevent console flooding
              console.log(
                `${i}: ${el.tagName} - "${el.textContent.trim()}" - ${
                  el.className
                }`
              );
            }
          });

          return false;
        }
      } catch (error) {
        console.error(`Error submitting form: ${error.message}`);
        console.error("Error stack:", error.stack);
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
