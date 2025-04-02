extends ReactiveTextureButton

func ready() -> void:
	
	global.level=1
	#TODO: get player data from server
	global.player={
		"name":"Pombo",
		"gold":100,
		"hp":5,"maxHp":5,
		"energy":10,"maxEnergy":10,
		"pointsLeft":5,
		"strength":1,"extraStrength":0,
		"defense":1,"extraDefense":0,
		"speed":1,"extraSpeed":0,
		"class":global.Classes.Normal
	}
	var _s1:=self.connect("pressed",self,"startGame")

	#TODO: after getting player data from server, might go into httpRequest
	# if global.player.name != "Pombo":
	# 	startGame()
	
func on_request_completed(result, response_code, headers, body):
	var json = JSON.parse_string(body.get_string_from_utf8())
	
func startGame(updatePlayer=true) -> void:
	global.player.name=get_parent().get_node("lineEdit").text
	if updatePlayer:
		global.setPlayerName()
	global.addMusicPartyCrasher()
	var _sc1=get_tree().change_scene("res://scenes/root.tscn")
func mouseEnter() -> void:
	global.createHoverSfx()

