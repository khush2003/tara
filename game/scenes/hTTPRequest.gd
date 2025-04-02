extends HTTPRequest


# Called when the node enters the scene tree for the first time.
func _ready():
	var token = get_parameter("token") #TODO: Enable in export
	self.connect("request_completed", self, "printUser")
	if token == null:
		token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmViYjA5ZGRmOTE4ZjJiNzJkMDQzYSIsImV4cCI6MTczMTIwMjE4NTY5Nn0.HcRJuY4QoDK9XVs9u67QsZ6x-IPJdvMGx2cbpTVRj4Y"
	var headers = ["Authorization: Bearer " + token]
	self.request(global.backendURL + "/auth/profile", headers, HTTPClient.METHOD_GET)

func printUser(result, response_code, headers, body: PoolByteArray):
	var data = body.get_string_from_utf8()
	var json = JSON.parse(data)
	if json.error == OK:
		var game_profile = json.result["game_profile"]
		global.player.name = game_profile["name"]
		global.game_minutes_left = int(game_profile["game_minutes_left"])
		if (game_profile["game_minutes_left"] > 0):
			global.start_game_timer()
			if global.player.name != "Pombo":
				get_node("%texBtnStartGame").startGame(false)
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
