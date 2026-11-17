obs = obslua

--[[ GLOBALS
-------------------------------------------------------------------------------------------------- ]]

local hotkey_defs = {
	{ id = "overlay_hotkeys_pause",  label = "Overlay pause",  action = "pause",  trigger = "trigger_key_pause"  },
	{ id = "overlay_hotkeys_resume", label = "Overlay resume", action = "resume", trigger = "trigger_key_resume" },
	{ id = "overlay_hotkeys_toggle", label = "Overlay toggle", action = "toggle", trigger = "trigger_key_toggle" },
	{ id = "overlay_hotkeys_skip",   label = "Overlay skip",   action = "skip",   trigger = "trigger_key_skip"   },
}

local hotkey_ids = {
	pause  = obs.OBS_INVALID_HOTKEY_ID,
	resume = obs.OBS_INVALID_HOTKEY_ID,
	toggle = obs.OBS_INVALID_HOTKEY_ID,
	skip   = obs.OBS_INVALID_HOTKEY_ID,
}

local overlay_keys = {
	pause  = "OBS_KEY_F1",
	resume = "OBS_KEY_F2",
	toggle = "OBS_KEY_F3",
	skip   = "OBS_KEY_F4",
}

--[[ HELPERS
-------------------------------------------------------------------------------------------------- ]]

local function is_browser_source(src)
	local id = obs.obs_source_get_id(src)
	return id ~= nil and id:find("browser_source", 1, true) ~= nil
end

local function refresh_source_list(prop)
	obs.obs_property_list_clear(prop)
	obs.obs_property_list_add_string(prop, "(no browser source)", "")

	local sources = obs.obs_enum_sources()
	if sources ~= nil then
		for _, src in ipairs(sources) do
			if is_browser_source(src) then
				local name = obs.obs_source_get_name(src)
				obs.obs_property_list_add_string(prop, name, name)
			end
		end
		obs.source_list_release(sources)
	end
end

local function refresh_sources(props, prop)
	local prop = obs.obs_properties_get(props, "browser_source")
	if prop == nil then return end
	refresh_source_list(prop)
	return true
end

local function send_key_click(source, key_name)
	local key = obs.obs_key_from_name(key_name)
	local vk = obs.obs_key_to_virtual_key(key)

	local event = obs.obs_key_event()
	event.native_vkey = vk
	event.native_scancode = vk
	event.modifiers = 0
	event.native_modifiers = 0
	event.text = ""

	obs.obs_source_send_key_click(source, event, false) -- key down
	obs.obs_source_send_key_click(source, event, true)  -- key up
end

local function trigger(action, label)
	if source_name == nil or source_name == "" then return end

	local source = obs.obs_get_source_by_name(source_name)
	if source == nil then return end

	send_key_click(source, overlay_keys[action])
	obs.obs_source_release(source)

	obs.script_log(obs.LOG_INFO, "'" .. label .. "' sent -> " .. overlay_keys[action] .. " to '" .. source_name .. "'")
end

local function button_trigger(action)
	return function()
		trigger(action, "Test")
	end
end

--[[ OBS CALLBACKS
-------------------------------------------------------------------------------------------------- ]]

function script_description()
	return "Adjust keybinds in OBS settings, they are disabled by default."
end

function script_properties()
	local props = obs.obs_properties_create()

	local p_source = obs.obs_properties_add_list(
		props,
		"browser_source",
		"Browser source",
		obs.OBS_COMBO_TYPE_LIST,
		obs.OBS_COMBO_FORMAT_STRING)

	refresh_source_list(p_source)

	obs.obs_properties_add_button(props, "refresh_source_list", "Refresh source list", refresh_sources)

	obs.obs_properties_add_button(props, "test_pause",  "Test pause",  button_trigger("pause"))
	obs.obs_properties_add_button(props, "test_resume", "Test resume", button_trigger("resume"))
	obs.obs_properties_add_button(props, "test_toggle", "Test toggle", button_trigger("toggle"))
	obs.obs_properties_add_button(props, "test_skip",   "Test skip",   button_trigger("skip"))

	return props
end

function script_update(settings)
	source_name = obs.obs_data_get_string(settings, "browser_source")
end

function script_load(settings)
	for _, def in ipairs(hotkey_defs) do
		local action = def.action
		local label = def.label

		hotkey_ids[action] = obs.obs_hotkey_register_frontend(def.id, label, function(pressed)
			if pressed then
				trigger(action, label)
			end
		end)

		local bindings = obs.obs_data_get_array(settings, def.id)
		obs.obs_hotkey_load(hotkey_ids[action], bindings)
		obs.obs_data_array_release(bindings)
	end
end

function script_save(settings)
	for _, def in ipairs(hotkey_defs) do
		local bindings = obs.obs_hotkey_save(hotkey_ids[def.action])
		obs.obs_data_set_array(settings, def.id, bindings)
		obs.obs_data_array_release(bindings)
	end
end
