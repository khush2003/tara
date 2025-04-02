extends HTTPRequest


# Called when the node enters the scene tree for the first time.
func _ready():
	var token = get_parameter("token") #TODO: Enable in export
	self.connect("request_completed", self, "printUser")
	if token == null:
		token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmViYjA5ZGRmOTE4ZjJiNzJkMDQzYSIsImV4cCI6MTczMTIwMjE4NTY5Nn0.HcRJuY4QoDK9XVs9u67QsZ6x-IPJdvMGx2cbpTVRj4Y"
		print("Switched")
	var headers = ["Authorization: Bearer " + token]
	print("Making http request")
	print(global.backendURL)
	self.request(global.backendURL + "/auth/profile", headers, HTTPClient.METHOD_GET)

func printUser(result, response_code, headers, body: PoolByteArray):
	print("Request result got")
	var data = body.get_string_from_utf8()
	var json = JSON.parse(data)
	if json.error == OK:
		var game_profile = json.result["game_profile"]
		global.player.name = game_profile["name"]
		global.player.hp = int(game_profile["hp"])
		global.player.maxHp = int(game_profile["maxHp"])
		global.player.energy = int(game_profile["energy"])
		global.player.maxEnergy = int(game_profile["maxEnergy"])
		global.player.pointsLeft = int(game_profile["pointsLeft"])
		global.player.strength = int(game_profile["strength"])
		global.player.extraStrength = int(game_profile["extraStrength"])
		global.player.defense = int(game_profile["defense"])
		global.player.extraDefense = int(game_profile["extraDefense"])
		global.player.speed = int(game_profile["speed"])
		global.player.extraSpeed = int(game_profile["extraSpeed"])
		global.player.class = int(game_profile["class"])
		global.level = int(game_profile["level"])
		global.hasIce = bool(game_profile["hasIce"])
		global.hasSword = bool(game_profile["hasSword"])
		global.hasWings = bool(game_profile["hasWings"])
		global.bHasItem = bool(game_profile["bHasItem"])
		global.player.gold = int(game_profile["game_points"])
		switch_player_texture_and_emit_signal(global.player.class)
		global.game_minutes_left = int(game_profile["game_minutes_left"])
		if (game_profile["game_minutes_left"] > 0):
			global.start_game_timer()
		else:
			global.game_minutes_left = 0
			global.end_game_due_to_timeout()
	else:
		print("Failed to parse JSON")


func get_parameter(parameter):
	if OS.has_feature('JavaScript'):
		return JavaScript.eval(""" 
				var url_string = window.location.href;
				var url = new URL(url_string);
				url.searchParams.get("token");
			""")
	return null

func switch_player_texture_and_emit_signal(player_class):	
	
	var target = get_node("%sprPlayerPigeon")
	target.texture = load(global.pigeonDict[player_class].sprite)
	if player_class in global.firstEvoPigeons:
		emit_signal("PlayerEvolved")
	elif player_class in global.secondEvoPigeons:
		emit_signal("PlayerEvolved")
	elif player_class in global.uncommonEvoPigeons:
		emit_signal("PlayerEvolved")
	
	if player_class == global.Classes.Stronga or player_class == global.Classes.Wyrm or player_class == global.Classes.Whey:
		emit_signal("PlayerEvolvedStr")
	# Emit defense evolution signal if necessary
	if player_class == global.Classes.Knight or player_class == global.Classes.Fridgeon or player_class == global.Classes.Crusader:
		emit_signal("PlayerEvolvedDef")

	# Emit speed evolution signal if necessary
	if player_class == global.Classes.Winged or player_class == global.Classes.Hatoshi or player_class == global.Classes.Winged2:
		emit_signal("PlayerEvolvedSpd")
