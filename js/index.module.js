import {
    getAuth,
    createConnection,
    subscribeEntities,
    ERR_HASS_HOST_REQUIRED,
} from "https://cdn.jsdelivr.net/npm/home-assistant-js-websocket@latest/dist/index.js";

window.init = async () => {
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

    const pantrylight = new Entity('light.pantry');
    const crockerylight = new Entity('light.crockery');
    const templebackdrop = new Entity('light.temple_background');
    const templelight = new Entity('light.temple_top');

    window.entities = {}

    entities[pantrylight.entity_id] = pantrylight;
    entities[crockerylight.entity_id] = crockerylight;
    entities[templebackdrop.entity_id] = templebackdrop;
    entities[templelight.entity_id] = templelight;

    function changed(ent) {
        console.log(ent)
        for (var entity in ent) {
            entity = ent[entity];
            if (entity.entity_id === 'light.pantry') {
                pantrylight.state = entity.state;
                pantrylight.attributes = entity.attributes;
            } else if (entity.entity_id === 'light.crockery') {
                crockerylight.state = entity.state;
                crockerylight.attributes = entity.attributes;
            } else if (entity.entity_id === 'light.temple_background') {
                templebackdrop.state = entity.state;
                templebackdrop.attributes = entity.attributes;
            } else if (entity.entity_id === 'light.temple_top') {
                templelight.state = entity.state;
                templelight.attributes = entity.attributes;
            }
        };
        updateUI();
    }


    window.toggle = (el) => {
        let entity = entities[el.getAttribute('data-entity')];
        connection.sendMessagePromise({
            type: 'call_service',
            domain: 'light',
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
        for (var entity in entities) {
            entity = entities[entity];
            const el = document.querySelector(`[data-entity="${entity.entity_id}"]`);
            const type = el.getAttribute('data-type');
            if (entity.state === 'on') {
                el.classList.add('hass-on');
            } else {
                el.classList.remove('hass-on');
            }

            if (type == 'strip') {
                if (entity.state === 'off') {
                    el.classList.remove('hass-on');
                    el.querySelector('.hass-entity-logo').innerHTML = '􁌥';
                } else {
                    el.classList.add('hass-on');
                    el.querySelector('.hass-entity-logo').innerHTML = '􁏒';
                }
            } else if (type == 'recessed') {
                if (entity.state === 'off') {
                    el.classList.remove('hass-on');
                    el.querySelector('.hass-entity-logo').innerHTML = '􁎾';
                } else {
                    el.classList.add('hass-on');
                    el.querySelector('.hass-entity-logo').innerHTML = '􁌢';
                }
            }
        };
    }
};