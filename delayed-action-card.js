const enabledCards = [
  "better-thermostat-ui-card",
  "hui-button-card",
  "hui-entities-card",
  "hui-entity-button-card",
  "hui-entity-card",
  "hui-glance-card",
  "hui-horizontal-stack-card",
  "hui-light-card",
  "hui-media-control-card",
  "hui-picture-elements",
  "hui-picture-glance-card",
  "hui-thermostat-card",
  "hui-vertical-stack-card",
  "mushroom-light-card",
  "mushroom-entity-card",
  "hui-tile-card",
  "mushroom-fan-card",
  "mushroom-thermostat-card",
  "mushroom-lock-card",
  "mushroom-vacuum-card",
  "mushroom-select-card",
  "bubble-card",
  "mushroom-template-badge",
  "hui-entity-badge",
  "mushroom-cover-card"
];

// FIX 1: fetchTasks was calling callWS with type:"call_service" which does not
// return service response data. The result was also never used — the card
// already receives updates via the delayed_action_list_actions_response event
// subscription. Replaced with a plain callService call to trigger that event.
async function fetchTasks(hass) {
  try {
    await hass.callService("delayed_action", "list");
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

function deepQuerySelectorAll(selector, rootNode = document.body) {
  const nodes = [];
  const traverse = (node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches(selector)) nodes.push(node);
    [...node.children].forEach(traverse);
    if (node.shadowRoot) [...node.shadowRoot.children].forEach(traverse);
  };
  traverse(rootNode);
  return nodes;
}

function extendCard(element, hass, config, tasks, entityId) {
  if (element.querySelector(".cornerButton")) {
    const innerDiv = element.querySelector(".cornerButton div");
    if (
      tasks &&
      Object.values(tasks).length > 0 &&
      element.__config.entity === entityId
    ) {
      innerDiv.style.backgroundColor = "var(--accent-color)";
      innerDiv.className = "blink";
    } else {
      innerDiv.style.backgroundColor = "var(--disabled-text-color)";
      innerDiv.className = "";
    }
    return;
  }
  cardElements(element, hass, config);
}

function extendMushroomCard(element, hass, config, tasks, entityId) {
  const container = element.shadowRoot
    .querySelector("ha-card mushroom-card mushroom-state-item")
    .shadowRoot.querySelector(".container");

  if (container.querySelector(".cornerButton")) {
    const innerDiv = container.querySelector(".cornerButton div");
    if (
      tasks &&
      Object.values(tasks).length > 0 &&
      element.___config.entity === entityId
    ) {
      innerDiv.style.backgroundColor = "var(--accent-color)";
      innerDiv.className = "blink";
    } else {
      innerDiv.style.backgroundColor = "var(--disabled-text-color)";
      innerDiv.className = "";
    }
    return;
  }
  cardElements(container, hass, config, '-6px');
}

function extendButtonCard(element, hass, config, tasks, entityId) {
  const container = element.shadowRoot.querySelector("ha-card");
  if (container.querySelector(".cornerButton")) {
    const innerDiv = container.querySelector(".cornerButton div");
    if (
      tasks &&
      Object.values(tasks).length > 0 &&
      element.___config.entity === entityId
    ) {
      innerDiv.style.backgroundColor = "var(--accent-color)";
      innerDiv.className = "blink";
    } else {
      innerDiv.style.backgroundColor = "var(--disabled-text-color)";
      innerDiv.className = "";
    }
    return;
  }
  cardElements(container, hass, config, "-6px");
}

function extendTileCard(element, hass, config, tasks, entityId) {
  const haCard = element.shadowRoot.querySelector("ha-card");
  let container;
  let resizedButton = false;
  if (element.parentElement.parentElement.style.cssText.indexOf("column-size") > -1) {
    container = haCard;
    resizedButton = true;
  } else {
    container = haCard.querySelector(".content");
  }
  if (container.querySelector(".cornerButton")) {
    const innerDiv = container.querySelector(".cornerButton div");
    if (resizedButton) {
      innerDiv.parentElement.style.top = "50%";
      innerDiv.parentElement.style.marginTop = "-11px";
    }
    if (
      tasks &&
      Object.values(tasks).length > 0 &&
      element.___config.entity === entityId
    ) {
      innerDiv.style.backgroundColor = "var(--accent-color)";
      innerDiv.className = "blink";
    } else {
      innerDiv.style.backgroundColor = "var(--disabled-text-color)";
      innerDiv.className = "";
    }
    return;
  }
  cardElements(container, hass, config, "-6px");
}

function extendBadge(element, hass, config, tasks, entityId) {
  const container = element;
  if (container.querySelector(".cornerButton")) {
    const innerDiv = container.querySelector(".cornerButton div");
    if (
      tasks &&
      Object.values(tasks).length > 0 &&
      config.entity === entityId
    ) {
      innerDiv.style.backgroundColor = "var(--accent-color)";
      innerDiv.className = "blink";
    } else {
      innerDiv.style.backgroundColor = "var(--disabled-text-color)";
      innerDiv.className = "";
    }
    return;
  }
  cardElementsBottom(container, hass, config, "-6px");
}

function cardElementsBottom(element, hass, config, offset, additionalClass) {
  cardElements(element, hass, config, offset, additionalClass);
  const cornerButton = element.querySelector(".cornerButton");
  cornerButton.style.right = null;
  cornerButton.style.bottom = "-5px";
  cornerButton.style.width = "12px";
  cornerButton.style.height = "12px";
  cornerButton.style.borderRight = null;
  cornerButton.style.borderBottom =
    "solid 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))";

  const cornerButtonIndicator = cornerButton.querySelector(".cornerButtonIndicator");
  cornerButtonIndicator.style.width = "6px";
  cornerButtonIndicator.style.height = "6px";
  cornerButtonIndicator.style.top = "3px";
  cornerButtonIndicator.style.left = "3px";
}

function cardElements(element, hass, config, offset, additionalClass) {
  const cornerButton = document.createElement("div");
  cornerButton.className = "cornerButton" + (additionalClass ? " " + additionalClass : "");
  cornerButton.style.position = "absolute";
  cornerButton.style.right =
    offset !== undefined && offset !== "" && offset.length > 0
      ? offset
      : element.className.indexOf("container") > -1
      ? "-30px"
      : "-22px";
  cornerButton.style.width = "22px";
  cornerButton.style.height = "22px";
  cornerButton.style.backgroundColor =
    "var(--ha-card-background, var(--card-background-color, #fff))";
  cornerButton.style.borderRadius = "12px";
  cornerButton.style.borderRight =
    "solid 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))";
  cornerButton.style.zIndex = "1";

  const innerDiv = document.createElement("div");
  innerDiv.className = "cornerButtonIndicator";
  innerDiv.style.borderRadius = "20px";
  innerDiv.style.width = "11px";
  innerDiv.style.height = "11px";
  innerDiv.style.top = "6px";
  innerDiv.style.left = "6px";
  innerDiv.style.position = "relative";
  innerDiv.style.backgroundColor = "var(--disabled-text-color)";
  cornerButton.appendChild(innerDiv);

  const timerDialog = document.createElement("div");
  timerDialog.style.display = "none";
  timerDialog.style.position = "absolute";
  timerDialog.style.top = "34px";
  timerDialog.style.right = "-28px";
  timerDialog.style.backgroundColor = "white";
  timerDialog.style.padding = "10px";
  timerDialog.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
  timerDialog.style.zIndex = "1";

  const secondsInput = document.createElement("input");
  secondsInput.type = "number";
  secondsInput.placeholder = "Seconds";

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";
  cancelButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    timerDialog.style.display = "none";
  });

  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const seconds = parseInt(secondsInput.value, 10);
    if (isNaN(seconds)) {
      return;
    }
    let entityId = config.entity;
    hass.callService("delayed_action", "execute", {
      entity_id: entityId,
      delay: seconds,
      action: "turn_on",
    });
    timerDialog.style.display = "none";
  });

  secondsInput.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });
  timerDialog.appendChild(secondsInput);
  timerDialog.appendChild(cancelButton);
  timerDialog.appendChild(submitButton);

  cornerButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog(hass, config.entity);
  });

  cornerButton.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  cornerButton.addEventListener("mouseup", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  element.style.position = "relative";
  element.appendChild(cornerButton);
  element.appendChild(timerDialog);
  const style = document.createElement("style");
  style.textContent = `
        .blink {
          animation: blink-animation 1s infinite;
        }
        @keyframes blink-animation {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `;
  element.appendChild(style);
}

function startsWithAny(entity, array) {
  return array.some((prefix) => entity.startsWith(prefix));
}

function findAndExtendCards(element, hass, tasks, entityId) {
  if (element.shadowRoot) {
    let cardElements = [];
    const homeAssistant = document.querySelector("home-assistant");
    if (homeAssistant.delayedActionConfig) {
      switch (element.tagName) {
        case "HUI-ENTITIES-CARD":
          cardElements = element.shadowRoot.querySelectorAll("ha-card");
          cardElements.forEach((card) => {
            if (card.getAttribute("extended") !== "true") {
              let elem = card.querySelectorAll("#states hui-toggle-entity-row, #states hui-cover-entity-row");
              if (elem.length > 0) {
                elem.forEach((e) => {
                  let rowElement = e.shadowRoot.querySelector(
                    "hui-generic-entity-row, hui-toggle-entity-row"
                  );
                  if (
                    rowElement.__config.hasOwnProperty("entity") && rowElement.__config.entity !== undefined &&
                    startsWithAny(
                      rowElement.__config.entity,
                      homeAssistant.delayedActionConfig.domains
                    )
                  ) {
                    extendCard(
                      rowElement,
                      hass,
                      {
                        entity: rowElement.__config.entity,
                      },
                      tasks,
                      entityId
                    );
                    e.setAttribute("extended", "true");
                  }
                });
              }
              elem = card.querySelectorAll("#states hui-toggle-entity-row, #states hui-cover-entity-row");
              if (elem.length > 0) {
                elem.forEach((e) => {
                  let rowElement = e.shadowRoot.querySelector(
                    "hui-generic-entity-row, hui-select-entity-row"
                  );
                  if (
                    rowElement.__config.hasOwnProperty("entity") && rowElement.__config.entity !== undefined &&
                    startsWithAny(
                      rowElement.__config.entity,
                      homeAssistant.delayedActionConfig.domains
                    )
                  ) {
                    extendCard(
                      rowElement,
                      hass,
                      {
                        entity: rowElement.__config.entity,
                      },
                      tasks,
                      entityId
                    );
                    e.setAttribute("extended", "true");
                  }
                });
              }
            }
          });
          break;
        case "HUI-BUTTON-CARD":
          if (
            element.___config.hasOwnProperty("entity") && element.___config.entity !== undefined &&
            startsWithAny(
              element.___config.entity,
              homeAssistant.delayedActionConfig.domains
            )
          ) {
            extendButtonCard(
              element,
              hass,
              {
                entity: element ? element.___config.entity : null,
              },
              tasks,
              entityId
            );
            element.setAttribute("extended", "true");
            element.shadowRoot.querySelector("ha-card").style.overflow =
              "visible";
          }
          break;
        case "HUI-COVER-CARD":
        case "HUI-LIGHT-CARD":
        case "HUI-TILE-CARD":
          if (
            element.___config.hasOwnProperty("entity") && element.___config.entity !== undefined &&
            startsWithAny(
              element.___config.entity,
              homeAssistant.delayedActionConfig.domains
            )
          ) {
            extendTileCard(
              element,
              hass,
              {
                entity: element ? element.___config.entity : null,
              },
              tasks,
              entityId
            );
            element.setAttribute("extended", "true");
            element.shadowRoot.querySelector("ha-card").style.overflow =
              "visible";
          }
          break;
        case "MUSHROOM-LIGHT-CARD":
        case "MUSHROOM-FAN-CARD":
        case "MUSHROOM-COVER-CARD":
        case "MUSHROOM-THERMOSTAT-CARD":
        case "MUSHROOM-LOCK-CARD":
        case "MUSHROOM-VACUUM-CARD":
        case "MUSHROOM-ENTITY-CARD":
        case "MUSHROOM-SELECT-CARD":
          if (
            element.___config.hasOwnProperty("entity") && element.___config.entity !== undefined &&
            startsWithAny(
              element.___config.entity,
              homeAssistant.delayedActionConfig.domains
            )
          ) {
            extendMushroomCard(
              element,
              hass,
              {
                entity: element ? element.___config.entity : null,
              },
              tasks,
              entityId
            );
            element.setAttribute("extended", "true");
          }
          break;
        case "MUSHROOM-TEMPLATE-BADGE":
        case "HUI-ENTITY-BADGE":
          if (
            element.___config.hasOwnProperty("entity") && element.___config.entity !== undefined &&
            startsWithAny(
              element.___config.entity,
              homeAssistant.delayedActionConfig.domains
            )
          ) {
            const targetElement = element.shadowRoot.children[0];
            extendBadge(
              targetElement,
              hass,
              {
                entity: element ? element.___config.entity : null,
              },
              tasks,
              entityId
            );
            element.setAttribute("extended", "true");
          }
          break;
        default:
          break;
      }
    }

    const childElements = element.shadowRoot.querySelectorAll(
      enabledCards.join(",")
    );
    childElements.forEach((child) =>
      findAndExtendCards(child, hass, tasks, entityId)
    );
  }
}

async function applyCardModifications(hass) {
  const cards = deepQuerySelectorAll(enabledCards.join(","));
  cards.forEach((element) => {
    findAndExtendCards(element, hass, []);
  });
}

async function _updateContent(hass, actions) {
  applyCardModifications(hass);
  const cards = deepQuerySelectorAll(enabledCards.join(","));
  cards.forEach((element) => {
    for (const [entityId, tasks] of Object.entries(actions)) {
      findAndExtendCards(element, hass, tasks, entityId);
    }
  });
}

function setupCustomExtension() {
  const homeAssistant = document.querySelector("home-assistant");
  if (homeAssistant) {
    if (homeAssistant.hass) {
      homeAssistant.hass.connection.subscribeEvents((event) => {
        if (event.event_type === "delayed_action_get_config_response") {
          homeAssistant.delayedActionConfig = event.data;
        }
      });
      homeAssistant.hass.connection.subscribeEvents((event) => {
        if (event.event_type === "delayed_action_list_actions_response") {
          _updateContent(homeAssistant.hass, event.data.actions);
        }
      });
      getConfig(homeAssistant.hass);
      applyCardModifications(homeAssistant.hass);
      fetchTasks(homeAssistant.hass);
    } else {
      window.setTimeout(setupCustomExtension, 500);
    }
  }
}

function getEntityActions(entityId) {
  let result = [];
  let titles = {
    turn_on: "Turn On",
    turn_off: "Turn Off",
    toggle: "Toggle",
    play_media: "Play Media",
    media_pause: "Pause",
    media_play: "Play",
    media_stop: "Stop",
    media_next_track: "Next Track",
    media_previous_track: "Previous Track",
    volume_mute: "Mute",
    volume_down: "Volume Down",
    volume_up: "Volume Up",
    open_cover: "Open",
    close_cover: "Close",
    stop_cover: "Stop",
    start: "Start",
    pause: "Pause",
    stop: "Stop",
    return_to_base: "Return to Base",
    locate: "Locate",
    lock: "Lock",
    unlock: "Unlock",
    open: "Open",
    trigger: "Trigger",
    dock: "Dock",
    start_mowing: "Start Mowing",
    select_option: "Select Option",
  };

  switch (entityId.split(".")[0]) {
    case "light":
    case "switch":
    case "input_boolean":
    case "script":
    case "fan":
    case "climate":
    case "siren":
    case "water_heater":
      result = ["turn_on", "turn_off", "toggle"];
      break;
    case "media_player":
      result = [
        "turn_on",
        "turn_off",
        "play_media",
        "media_pause",
        "media_play",
        "media_stop",
        "media_next_track",
        "media_previous_track",
        "volume_mute",
        "volume_down",
        "volume_up",
      ];
      break;
    case "cover":
      result = ["open_cover", "close_cover", "stop_cover"];
      break;
    case "vacuum":
      result = ["start", "pause", "stop", "return_to_base", "locate"];
      break;
    case "lock":
      result = ["lock", "unlock", "open"];
      break;
    case "scene":
      result = ["turn_on"];
      break;
    case "automation":
      result = ["turn_on", "turn_off", "trigger"];
      break;
    case "lawn_mower":
      result = ["dock", "pause", "start_mowing"];
      break;
    case "select":
    case "input_select":
      result = ["select_option"];
      break;
    default:
      break;
  }
  return result
    .map((action) => `<option value="${action}">${titles[action]}</option>`)
    .join("");
}

function openDialog(hass, entityId) {
  const dialog = document.createElement("ha-dialog");
  dialog.open = true;

  // FIX 2: ha-dialog heading should be set as a string attribute or via the
  // named slot. Setting it as a property with a DOM element is not the
  // documented API. Using slot="heading" with a div is the safe approach.
  const dialogHeadingSlot = document.createElement("div");
  dialogHeadingSlot.setAttribute("slot", "heading");
  dialogHeadingSlot.style.display = "flex";
  dialogHeadingSlot.style.gap = "12px";
  dialogHeadingSlot.style.alignItems = "center";
  dialogHeadingSlot.style.padding = "12px 24px 0";
  dialogHeadingSlot.innerHTML = `
    <ha-icon-button id="closeButton" label="Close" style="--mdc-icon-button-size: 36px;">
      <ha-icon icon="mdi:close"></ha-icon>
    </ha-icon-button>
    <span style="font-size: 1.1em; font-weight: 500;">Delayed Action</span>
  `;
  dialog.appendChild(dialogHeadingSlot);

  const content = document.createElement("div");

  let selectOptions = entityId.indexOf("select.") > -1
    ? `<label for="delayOption">Option</label><select id="delayOption">` +
      hass.states[entityId].attributes.options.map(
        (option) => `<option value="${option}">${option}</option>`
      ).join("") +
      `</select>`
    : ``;

  content.innerHTML = `
    <style>
      .custom-dialog-content {
        padding: 0px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 500px;
        box-sizing: border-box;
      }
      .custom-dialog-content select,
      .custom-dialog-content input[type="datetime-local"] {
        padding: 8px;
        font-size: 1.2em;
        border: none;
        outline: none;
        border-radius: 4px;
        width: 100%;
      }
      .custom-dialog-content label {
        font-weight: bold;
      }
      .time-input {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .time-input input[type="number"] {
        width: 50px;
        padding: 8px;
        text-align: center;
        font-size: 1.2em;
        border: none;
        outline: none;
      }
      .time-input input[type="number"]::-webkit-outer-spin-button,
      .time-input input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .time-input input[type="number"] {
        -moz-appearance: textfield;
      }
      .time-input .time-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 30%;
        touch-action: manipulation;
      }
      .time-input .time-control button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
        color: var(--primary-color);
        --mdc-icon-size: 64px;
      }
      #delayDate {
        width: 100%;
      }
    </style>
    <div class="custom-dialog-content">
      <label for="delayAction">Action</label>
      <select id="delayAction">${getEntityActions(entityId)}</select>
      ${selectOptions}
      <label for="delayTime">Delay for</label>
      <div id="delayTime" class="time-input">
        <div class="time-control">
          Hours
          <button id="increaseHours"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
          <input id="delayHours" type="number" min="0" max="23" placeholder="HH" value="0">
          <button id="decreaseHours"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
        </div>
        <span></span>
        <div class="time-control">
          Minutes
          <button id="increaseMinutes"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
          <input id="delayMinutes" type="number" min="0" max="59" placeholder="MM" value="0">
          <button id="decreaseMinutes"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
        </div>
        <span></span>
        <div class="time-control">
          Seconds
          <button id="increaseSeconds"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
          <input id="delaySeconds" type="number" min="0" max="59" placeholder="SS" value="0">
          <button id="decreaseSeconds"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
        </div>
      </div>
      <label for="delayDate">or start at</label>
      <input id="delayDate" type="datetime-local">
      <p style="font-size: 0.8em; color: var(--error-color); display:none" id="error"></p>
    </div>
  `;

  // FIX 3: mwc-button was removed from HA frontend in 2024.8. Replaced with
  // plain <button> elements styled to match HA's visual style. These are
  // appended into the dialog's primaryAction / secondaryAction slots, which
  // ha-dialog still supports.
  const primaryButton = document.createElement("button");
  primaryButton.setAttribute("slot", "primaryAction");
  primaryButton.id = "submitButton";
  primaryButton.innerText = "Submit";
  primaryButton.style.cssText = `
    padding: 8px 16px;
    background-color: var(--primary-color);
    color: var(--text-primary-color, white);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    min-width: 80px;
  `;
  primaryButton.addEventListener("click", () => {
    const hours = parseInt(delayHours.value, 10) || 0;
    const minutes = parseInt(delayMinutes.value, 10) || 0;
    const seconds = parseInt(delaySeconds.value, 10) || 0;
    const date = delayDate.value;
    const action = content.querySelector("#delayAction").value || "turn_on";
    const select = content.querySelector("#delayOption");
    const errorEl = content.querySelector("#error");

    if (hours === 0 && minutes === 0 && seconds === 0 && !date) {
      errorEl.innerText = "Please enter a delay time or a start date.";
      errorEl.style.display = "block";
      return;
    }

    const delay = hours * 3600 + minutes * 60 + seconds;

    let config = {
      entity_id: entityId,
      action: action,
    };

    // FIX 4: config.data was undefined, causing a TypeError when trying to set
    // config.data.option. Also fixed the condition: || should be && to correctly
    // check that select is neither null nor undefined.
    if (select !== null && select !== undefined) {
      config.data = { option: select.value };
    }

    if (date) {
      config.datetime = date;
    } else {
      config.delay = delay;
    }

    hass.callService("delayed_action", "execute", config);
    closeDialog();
  });

  function closeDialog() {
    const existingDialog = document
      .querySelector("home-assistant")
      .shadowRoot.querySelector("ha-dialog");
    if (existingDialog) existingDialog.remove();
  }

  const secondaryButton = document.createElement("button");
  secondaryButton.setAttribute("slot", "secondaryAction");
  secondaryButton.innerText = "Cancel";
  secondaryButton.style.cssText = `
    padding: 8px 16px;
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    min-width: 80px;
  `;
  secondaryButton.addEventListener("click", closeDialog);

  dialog.appendChild(content);
  dialog.appendChild(secondaryButton);
  dialog.appendChild(primaryButton);
  document.querySelector("home-assistant").shadowRoot.appendChild(dialog);

  const delayHours = content.querySelector("#delayHours");
  const delayMinutes = content.querySelector("#delayMinutes");
  const delaySeconds = content.querySelector("#delaySeconds");
  const delayDate = content.querySelector("#delayDate");
  const increaseHours = content.querySelector("#increaseHours");
  const decreaseHours = content.querySelector("#decreaseHours");
  const increaseMinutes = content.querySelector("#increaseMinutes");
  const decreaseMinutes = content.querySelector("#decreaseMinutes");
  const increaseSeconds = content.querySelector("#increaseSeconds");
  const decreaseSeconds = content.querySelector("#decreaseSeconds");

  const closeButton = dialogHeadingSlot.querySelector("#closeButton");
  closeButton.addEventListener("click", closeDialog);

  // FIX 5: incrementValue/decrementValue were querying #error via
  // home-assistant's shadowRoot, but #error lives inside the content div.
  // Fixed to use content.querySelector instead.
  const incrementValue = (input, max) => {
    let value = parseInt(input.value, 10);
    if (isNaN(value)) value = 0;
    value = (value + 1) % (max + 1);
    input.value = value;
    content.querySelector("#error").style.display = "none";
  };

  const decrementValue = (input, max) => {
    let value = parseInt(input.value, 10);
    if (isNaN(value)) value = 0;
    value = (value - 1 + (max + 1)) % (max + 1);
    input.value = value;
    content.querySelector("#error").style.display = "none";
  };

  increaseHours.addEventListener("click", () => incrementValue(delayHours, 23));
  decreaseHours.addEventListener("click", () => decrementValue(delayHours, 23));
  increaseMinutes.addEventListener("click", () => incrementValue(delayMinutes, 59));
  decreaseMinutes.addEventListener("click", () => decrementValue(delayMinutes, 59));
  increaseSeconds.addEventListener("click", () => incrementValue(delaySeconds, 59));
  decreaseSeconds.addEventListener("click", () => decrementValue(delaySeconds, 59));
}

const getConfig = async (hass) => {
  await hass.callService("delayed_action", "get_config").catch((error) => {
    console.error("Error fetching config:", error);
  });
};

window.setTimeout(setupCustomExtension, 500);

// FIX 1 (continued): The setInterval previously called fetchTasks which used
// the broken callWS approach. Now fetchTasks uses callService, which triggers
// the delayed_action_list_actions_response event the card already subscribes
// to. The interval is kept to periodically refresh state.
setInterval(() => {
  const homeAssistant = document.querySelector("home-assistant");
  if (homeAssistant && homeAssistant.hass) {
    fetchTasks(homeAssistant.hass);
  }
}, 10000);

class DelayedActionCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
    this.attachShadow({ mode: "open" });
    this.render();
  }

  connectedCallback() {
    if (this.isConnected) {
      this.hass.connection.subscribeEvents((event) => {
        if (event.event_type === "delayed_action_list_actions_response") {
          this.tasks = event.data.actions;
          this.render();
        }
      });
    }
  }

  async cancelTask(event) {
    const entityId = event.target.getAttribute("data-entity");
    const taskId = event.target.getAttribute("data-task");
    try {
      await this.hass.callService("delayed_action", "cancel", {
        entity_id: entityId,
        task_id: taskId,
      });
      this.hass.callService("delayed_action", "list");
    } catch (error) {
      console.error("Error cancelling task:", error);
    }
  }

  getFriendlyName(entityId) {
    const entity = this.hass.states[entityId];
    return entity ? entity.attributes.friendly_name : entityId;
  }

  getActionIcon(action) {
    switch (action) {
      case "turn_on":
        return "mdi:power";
      case "turn_off":
        return "mdi:power-off";
      case "toggle":
        return "mdi:toggle-switch";
      default:
        return "mdi:alert-circle-outline";
    }
  }

  render() {
    if (!this.hass || !this.tasks) return;

    let taskList = "";
    for (const [entityId, tasks] of Object.entries(this.tasks)) {
      taskList += `<div class="taskentity"><h2>${this.getFriendlyName(entityId)}</h2>`;
      for (const [action, task] of Object.entries(tasks)) {
        taskList += `
          <div class="task">
            <ha-icon icon="${this.getActionIcon(task.action)}"></ha-icon>
            <span>${
              task.action === "turn_on"
                ? "turn on"
                : task.action === "turn_off"
                ? "turn off"
                : task.action === "toggle"
                ? "toggle"
                : task.action
            }</span>
            <span>${new Date(task.due).toLocaleString()}</span>
            <button class="cancel-button deleteDelayedAction"
              data-entity="${entityId}"
              data-task="${task.task_id}">Cancel</button>
          </div>
        `;
      }
      taskList += `</div>`;
    }

    // FIX 3 (continued): mwc-button replaced with a plain <button> in the
    // task list render as well.
    this.shadowRoot.innerHTML = `
      <style>
        .tasks {
          padding: 16px;
        }
        .taskentity {
          margin-bottom: 16px;
        }
        .task {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        ha-icon {
          padding-right: 8px;
        }
        .cancel-button {
          padding: 6px 12px;
          background-color: transparent;
          color: var(--error-color);
          border: 1px solid var(--error-color);
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
          margin-bottom: 4px;
        }
        .cancel-button:hover {
          background-color: var(--error-color);
          color: white;
        }
      </style>
      <ha-card header="Delayed Actions">
        <div class="tasks">
          ${taskList}
        </div>
      </ha-card>
    `;
    this.shadowRoot
      .querySelectorAll(".deleteDelayedAction")
      .forEach((button) => {
        button.addEventListener("click", this.cancelTask.bind(this));
      });
  }

  set hass(hass) {
    this._hass = hass;
  }

  get hass() {
    return this._hass;
  }
}

customElements.define("delayed-action-card", DelayedActionCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "delayed-action-card",
  name: "Delayed Action Card",
  description: "Shows and manages delayed actions",
  preview: true,
  documentationURL: "https://github.com/bhuebschen/delayed-action-card",
});

console.info(
  "%c  DELAYED-ACTION-CARD  \n%c  Version: 1.0.4-fixed  ",
  "background: #c0c0c0; color: black; font-weight: bold; padding: 5px 0;",
  "color: white; background: #333; font-weight: bold; padding: 5px 0;"
);