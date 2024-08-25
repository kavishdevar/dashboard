import {
    getAuth,
    createConnection,
    subscribeEntities,
    ERR_HASS_HOST_REQUIRED,
} from "https://cdn.jsdelivr.net/npm/home-assistant-js-websocket@latest/dist/index.js";

window.init = async (entities) => {
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
    class Entity {
        constructor(entity_id) {
            this.entity_id = entity_id;
            this.state = null;
            this.attributes = {};
        }
    }

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
        entities.forEach(entity => {
            // const entities = [
            //     { name: "Pantry Light", entity: "light.pantry", type: "strip" },
            //     { name: "Crockery Light", entity: "light.crockery", type: "recessed" },
            //     { name: "Temple Strip light", entity: "light.temple_background", type: "strip" },
            //     { name: "Temple Drop Light", entity: "light.temple_top", type: "recessed" },
            //     { name: "Kavish's Air Conditioner", entity: "switch.kavish_ac", type: "ac" }
            // ];
        
            const el = document.querySelector(`[data-entity="${entity.entity_id}"]`);
            console.log(el);
            const type = el.getAttribute('data-type');
            const logo = el.querySelector('.hass-entity-logo');

            el.classList.toggle('hass-on', entity.state === 'on');

            if (type && logo) {
                const icons = {
                    strip: { on: '􁏒', off: '􁌥' },
                    recessed: { on: '􁌢', off: '􁎾' },
                    ac: { on: '􁓮', off: '􁓭' }
                };
                if (entity.state === 'unavailable') {
                    logo.innerHTML = icons[type].off;
                    document.querySelector(`[data-entity="${entity.entity_id}"]`).classList.add('hass-unavailable');
                }
                logo.innerHTML = icons[type][entity.state];
            }
        });
    }
};