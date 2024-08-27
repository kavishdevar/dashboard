import {
    getAuth,
    createConnection,
    subscribeEntities,
    ERR_HASS_HOST_REQUIRED,
} from "https://cdn.jsdelivr.net/npm/home-assistant-js-websocket@latest/dist/index.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue, get} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

window.init = async (list) => {
    class Entity {
        constructor(entity_id) {
            this.entity_id = entity_id;
            this.state = "off";
            this.attributes = {};
        }
    }

    window.entities = [];

    list.forEach(item => {
        entities[item.entity_id] = new Entity(item.entity_id);
    });

    function changed(ent) {
        for (const entity_id in ent) {
            const entity = ent[entity_id];
            if (entities[entity.entity_id]) {
                entities[entity.entity_id].state = entity.state;
                entities[entity.entity_id].attributes = entity.attributes;
            }
        }
        updateUI();
    }


    window.toggle = (el) => {
        let entity = entities[el.getAttribute('data-entity')];
        connection.sendMessagePromise({
            type: 'call_service',
            domain: entity.entity_id.split('.')[0],
            service: entity.state === 'on' ? 'turn_off' : 'turn_on',
            service_data: {
                entity_id: entity.entity_id
            },
        }).then(() => {
            entity.state = entity.state === 'on' ? 'off' : 'on';
            updateUI();
        });
        updateUI();
    };

    function updateUI() {
        for (const entity_id in entities) {
            const entity = entities[entity_id];
            const el = document.querySelector(`[data-entity="${entity.entity_id}"]`);
            const type = el.getAttribute('data-type');
            const logo = el.querySelector('.hass-entity-logo');
            el.classList.toggle('hass-on', entity.state === 'on');

            if (type && logo) {
                const icons = {
                    strip: { on: '􁏒', off: '􁌥' },
                    recessed: { on: '􁌢', off: '􁎾' },
                    ac: { on: '􁓮', off: '􁓭' }
                };
                if (entity.state === "unavailable") {
                    logo.innerHTML = icons[type].off;
                    document.querySelector(`[data-entity="${entity.entity_id}"]`).classList.add('hass-unavailable');
                }
                else { logo.innerHTML = icons[type][entity.state] }
            }
        };
    }

    updateUI();


    let auth;
    const hassUrl = "http://192.168.1.222:8123";
    try {
        auth = await getAuth(
            {
                hassUrl,
                saveTokens: (tokens) => {
                    localStorage.setItem("tokens", JSON.stringify(tokens));
                },
                loadTokens: () => {
                    return JSON.parse(localStorage.getItem("tokens"));
                }
            }
        );
    } catch (err) {
        if (err === ERR_HASS_HOST_REQUIRED) {
            const auth = await getAuth({
                hassUrl,
                redirectUrl: window.location.href,
                saveTokens: (tokens) => {
                    localStorage.setItem("tokens", JSON.stringify(tokens));
                }
            });
        } else {
            alert(`Unknown error: ${err}`);
            return;
        }
    }
    const connection = await createConnection({ auth });
    subscribeEntities(connection, (entities) => {
        changed(entities);
    });

    let firebaseConfig;
    await fetch('data.json').then(response => response.json().then(data => firebaseConfig = data.firebase));
    
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    
    const dbRef = ref(db, 'notifications/id/message');
    
    // data structure: 
    // { randomid: { message: 'This is a message', read: true/false} }
    // get data once
    
    get(dbRef).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log('Data:', data);
        } else {
            console.log('No data available');
        }
    });

    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log('Data changed:', data);
        } else {
            console.log('No data available');
        }
    });
};