// ==UserScript==
// @name         Google Form Auto-Fill - New Survey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills and submits a specific Google Form 300 times with logical random data
// @author       You
// @match        https://docs.google.com/forms/d/e/1FAIpQLSeaftRoxUXTS9DQ802453-yXLyFucZDpxc5tiHYAtVcnB7V6w/viewform*
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
      feedback: [
        "Very helpful and informative.",
        "Easy to understand and navigate.",
        "I found it quite useful for my needs.",
        "Clear instructions and good design.",
        "Straightforward and efficient.",
        "Well organized and comprehensive.",
        "Concise and to the point.",
        "Helpful but could use some improvements.",
        "Excellent resource, very detailed.",
        "Good overall, met my expectations.",
      ],
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
      ],
      comments: [
        "Thank you for this opportunity to provide feedback.",
        "I really enjoyed participating in this survey.",
        "Looking forward to seeing the results of this research.",
        "The questions were thoughtful and relevant to the topic.",
        "I appreciate being included in this study.",
        "This survey was well-designed and easy to complete.",
        "Hope my responses are helpful for your research.",
        "I found the topics covered quite interesting.",
        "Happy to contribute to this important work.",
        "The survey was a good length - not too long or short.",
      ],
      suggestions: [
        "Consider adding more visual elements to enhance engagement.",
        "It might be helpful to include more examples in some sections.",
        "Adding a progress bar would be beneficial for longer surveys.",
        "Consider grouping similar questions together for better flow.",
        "Providing some background information before complex questions could help.",
        "Maybe include an option to save and continue later for longer surveys.",
        "Consider adding hover explanations for technical terms.",
        "A summary of responses at the end would be nice.",
        "Perhaps include fewer required questions where possible.",
        "Adding confirmation before final submission would be helpful.",
      ],

      // Apple-specific answers for the survey
      apple_loyalty_reasons: [
        "The seamless ecosystem integration between all Apple products makes my digital life much easier.",
        "Superior build quality and design aesthetics that stand the test of time.",
        "The intuitive user interface that makes even complex tasks simple to perform.",
        "Robust privacy and security features that protect my personal data.",
        "Excellent customer service and support through Apple Care and Genius Bar.",
        "Consistent software updates that keep my devices running smoothly for years.",
        "The premium experience that comes with using products designed with attention to detail.",
        "Integration with services like iCloud that keeps all my data synchronized across devices.",
        "The reliability factor - Apple products just work when I need them to.",
        "Brand reputation for innovation and quality that I've experienced firsthand.",
        "The high resale value makes the initial investment more justifiable than other brands.",
        "Apple's commitment to accessibility features makes their products usable by everyone.",
        "The app ecosystem with high-quality, vetted applications ensures a safer experience.",
        "Family sharing features make it easy to manage multiple devices across household members.",
        "The focus on user privacy aligns with my personal values about data protection.",
        "The consistency in user experience across different devices reduces learning curves.",
        "Apple's environmental initiatives and sustainability efforts match my ethical concerns.",
        "The minimalist approach to design reduces distraction and increases productivity.",
        "The exclusive features that aren't available on other platforms keep me in the ecosystem.",
        "The status symbol aspect and recognition of the brand adds value to my professional image.",
      ],

      ai_concerns: [
        "Privacy implications of AI collecting and analyzing my personal data and usage patterns.",
        "Potential over-automation that might remove human touch from customer interactions.",
        "Accuracy and reliability of AI recommendations and features in real-world scenarios.",
        "Transparency about what data is being collected and how it's being used to train AI models.",
        "Accessibility concerns for users who may not be comfortable with advanced AI features.",
        "Over-reliance on AI for decision making could limit genuine human creativity and innovation.",
        "Battery drain and performance impact of running AI processes on mobile devices.",
        "Security vulnerabilities that could emerge from more complex AI systems.",
        "Ethical considerations around how Apple's AI judges and categorizes user content.",
        "Long-term impact on user skills if AI takes over too many tasks we currently do ourselves.",
        "Algorithmic bias potentially perpetuating societal inequalities through AI decisions.",
        "The environmental impact of training large AI models and increased power consumption.",
        "User dependency on AI systems that may reduce critical thinking skills over time.",
        "The unclear boundary between helpful personalization and invasive prediction of behavior.",
        "Concerns about how Apple might monetize insights gained from AI analysis of user data.",
        "The risk of Apple creating an AI ecosystem that's difficult to leave once fully invested.",
        "Uncertainty about how AI features might evolve in ways that users didn't anticipate or consent to.",
        "The potential for surveillance capabilities through always-listening AI assistants.",
        "Questions about ownership of content created using generative AI tools on Apple devices.",
        "Worries about AI developing in ways that prioritize Apple's business goals over user needs.",
      ],

      product_improvements: [
        "Better battery life across all devices, especially for demanding tasks like video editing and gaming.",
        "More customization options in iOS to personalize the user experience.",
        "Improved Siri capabilities that better understand context and handle complex requests.",
        "More affordable entry-level options that maintain Apple quality standards.",
        "Enhanced cross-platform compatibility with non-Apple devices and services.",
        "More repair-friendly designs that support the right to repair movement.",
        "Expanded environmental initiatives to make products more sustainable and recyclable.",
        "More robust cloud services with competitive pricing compared to alternatives.",
        "Advanced AI features that anticipate user needs without compromising privacy.",
        "Better thermal management for sustained performance in MacBooks during intensive tasks.",
        "USB-C standardization across all devices including the iPhone for universal connectivity.",
        "Improved file system access and management options for power users on iOS devices.",
        "More comprehensive backup solutions that don't require iCloud subscription upgrades.",
        "Enhanced multitasking capabilities on iPad to truly replace laptop functionality.",
        "Deeper integration of health tracking across all Apple devices beyond just the Watch.",
        "More powerful automation tools that bridge functionality between different Apple apps.",
        "Expanded Apple Pencil compatibility with more devices and improved writing recognition.",
        "Better developer tools and app store policies to encourage more innovative applications.",
        "More granular privacy controls that let users decide exactly what data each app can access.",
        "Improved keyboard designs on MacBooks with better key travel and durability.",
      ],

      marketing_changes: [
        "Focus more on practical user benefits rather than technical specifications in advertisements.",
        "Reduce pricing premium or better justify the higher cost through clear value communication.",
        "Increase transparency about product limitations instead of only highlighting strengths.",
        "Develop more inclusive marketing that represents diverse user demographics and use cases.",
        "Move away from the 'premium only' image to attract more budget-conscious consumers.",
        "Create more educational content about how to maximize the value of the Apple ecosystem.",
        "Showcase more real-world professional applications rather than aspirational lifestyle imagery.",
        "Address competitive advantages directly rather than ignoring the competition entirely.",
        "Better communicate the long-term value proposition including device longevity and support.",
        "Reduce the frequency of product releases to avoid customer upgrade fatigue.",
        "Include more technical details in marketing for enthusiast consumers who appreciate the engineering.",
        "Use more realistic scenarios in advertisements instead of idealized situations.",
        "Emphasize the environmental benefits of Apple products more prominently in marketing campaigns.",
        "Create comparisons that show clear trade-offs between Apple and competitor products, not just advantages.",
        "Develop marketing that acknowledges different budget levels rather than one-size-fits-all messaging.",
        "Highlight the community of Apple users and developers more in promotional materials.",
        "Place greater emphasis on accessibility features in mainstream advertisements, not just specialized ones.",
        "Create more region-specific marketing that addresses local consumer priorities and concerns.",
        "Increase transparency around planned product lifecycles to help consumers make informed decisions.",
        "Balance the focus between hardware innovations and software improvements in marketing messages.",
      ],

      future_products: [
        "More affordable AR/VR devices that bring mixed reality experiences to mainstream consumers.",
        "AI-powered health monitoring systems that integrate across the entire Apple ecosystem.",
        "Autonomous transportation solutions that integrate with Apple's software ecosystem.",
        "Expanded home automation products that work seamlessly with existing Apple devices.",
        "Professional creative tools that challenge established industry standards.",
        "Sustainable tech products made with environmentally-friendly materials and processes.",
        "Educational technology that transforms how students learn with Apple devices.",
        "Enterprise-focused services and hardware for business productivity and security.",
        "Wearable technology beyond watches that integrates health and communication features.",
        "Advanced accessibility devices that help people with disabilities navigate digital experiences.",
        "Ambient computing devices that blend invisibly into home environments while providing useful functions.",
        "Enhanced digital wellness tools that help users maintain healthy relationships with technology.",
        "Privacy-focused social networking alternatives that challenge existing platforms.",
        "Personal robotics that can interface with Apple ecosystem for household assistance.",
        "Streamlined productivity tools that bridge the gap between consumer and professional software.",
        "Advanced biometric security systems that go beyond Face ID and Touch ID.",
        "Specialized devices for creative professionals that compete with dedicated industry tools.",
        "Sustainable energy solutions that integrate with Apple products and smart home systems.",
        "More comprehensive family-oriented products that safely introduce technology to children.",
        "Healthcare partnerships that create specialized medical devices running Apple software.",
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

    // Get appropriate short answer based on question content
    function getAppropriateShortAnswer(questionText) {
      console.log(`Selecting answer for question: "${questionText}"`);

      if (!questionText) {
        return ""; // Return empty for no question text
      }

      // Convert to lowercase for case-insensitive matching
      const text = questionText.toLowerCase();

      // Apple survey specific questions with direct matching
      if (
        text.includes("what keeps you loyal to the apple brand") ||
        (text.includes("loyal") && text.includes("apple"))
      ) {
        console.log("Matched Apple loyalty question");
        return safeGetRandomAnswer("apple_loyalty_reasons");
      }

      if (
        text.includes(
          "what are your biggest concerns regarding apple's use of ai"
        ) ||
        (text.includes("concerns") &&
          text.includes("ai") &&
          text.includes("apple"))
      ) {
        console.log("Matched Apple AI concerns question");
        return safeGetRandomAnswer("ai_concerns");
      }

      if (
        text.includes(
          "what improvements would you like to see in future apple products"
        ) ||
        (text.includes("improvements") && text.includes("apple products"))
      ) {
        console.log("Matched Apple product improvements question");
        return safeGetRandomAnswer("product_improvements");
      }

      if (
        text.includes(
          "if you could change one thing about apple's marketing strategy"
        ) ||
        (text.includes("change") &&
          text.includes("apple") &&
          text.includes("marketing"))
      ) {
        console.log("Matched Apple marketing strategy question");
        return safeGetRandomAnswer("marketing_changes");
      }

      if (
        text.includes(
          "what products do you think apple should focus on developing"
        ) ||
        (text.includes("products") &&
          text.includes("apple") &&
          text.includes("developing"))
      ) {
        console.log("Matched Apple future products question");
        return safeGetRandomAnswer("future_products");
      }

      // Check for general categories if no specific Apple question matches
      if (text.includes("name") && text.length < 30) {
        return safeGetRandomAnswer("name");
      } else if (text.includes("email")) {
        return safeGetRandomAnswer("email");
      } else if (text.includes("phone")) {
        return safeGetRandomAnswer("phone");
      } else if (text.includes("address") || text.includes("location")) {
        // For address-related questions
        return safeGetRandomAnswer("address", {
          address: [
            "123 Main Street, Apt 4B",
            "456 Oak Avenue, Suite 202",
            "789 Pine Boulevard",
            "321 Maple Road",
            "555 Cedar Lane",
            "987 Elm Street, Unit 7C",
            "654 Birch Court",
            "852 Willow Drive",
            "159 Cherry Way",
            "753 Spruce Avenue",
          ],
        });
      } else if (text.includes("date") || text.includes("birth")) {
        // For date-related questions
        const dates = [
          "01/15/1985",
          "03/22/1990",
          "07/08/1988",
          "11/30/1992",
          "05/17/1986",
          "09/03/1991",
          "02/28/1989",
          "06/12/1987",
          "04/25/1993",
          "08/19/1984",
        ];
        return dates[getRandomInt(0, dates.length - 1)];
      } else if (text.includes("age")) {
        // For age questions
        const ages = [
          "25",
          "28",
          "32",
          "35",
          "27",
          "31",
          "29",
          "34",
          "26",
          "33",
        ];
        return ages[getRandomInt(0, ages.length - 1)];
      } else if (
        text.includes("occupation") ||
        text.includes("job") ||
        text.includes("profession")
      ) {
        // For occupation questions
        const jobs = [
          "Software Engineer",
          "Marketing Specialist",
          "Teacher",
          "Graphic Designer",
          "Financial Analyst",
          "Nurse",
          "Sales Representative",
          "Project Manager",
          "Chef",
          "Customer Service Representative",
        ];
        return jobs[getRandomInt(0, jobs.length - 1)];
      } else if (
        text.includes("apple") &&
        (text.includes("suggest") ||
          text.includes("improve") ||
          text.includes("future"))
      ) {
        // For any other Apple improvement-related questions not caught above
        return safeGetRandomAnswer("product_improvements");
      } else if (text.includes("apple") && text.includes("marketing")) {
        // For any other Apple marketing-related questions not caught above
        return safeGetRandomAnswer("marketing_changes");
      } else if (text.includes("ai") && text.includes("apple")) {
        // For any other Apple AI-related questions not caught above
        return safeGetRandomAnswer("ai_concerns");
      }

      // Leave blank for questions that don't match any pattern
      console.log("No match found for question, leaving blank");
      return "";
    }

    // Enhanced function to extract specific question text from custom forms
    function extractQuestionText(container) {
      // Try to find a direct label element for this question
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
          .sort((a, b) => b.text.length - a.text.length); // Sort by text length descending

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

    function debugFormStructure() {
      console.log("--- DEBUG: Form Structure Analysis ---");

      // Look for form elements
      const forms = document.querySelectorAll("form");
      console.log(`Found ${forms.length} form elements`);

      // Count potential question containers
      const divs = document.querySelectorAll("div");
      console.log(`Total div elements: ${divs.length}`);

      // Check common input elements
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
