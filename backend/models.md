# Models
This file has all the v1 models in a easy to read format.

> HydratedDocument type from mongoose adds things like _id to the interface

## Collection: `User`


| Field                    | Type                                      | Description                                                                 |
|--------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| name                     | string                                    | The name of the user.                                                       |
| email                    | string                                    | The email address of the user.                                              |
| password                 | string                                    | The password for the user's account.                                        |
| role                     | Enum("teacher", "student", "admin")       | The role of the user in the system.                                         |
| profile_picture          | string                                    | URL to the user's profile picture.                                          |
| school                   | string                                    | The school the user is associated with.                                     |
| classroom                | [id, Ref classroom]                       | References to the classrooms the user is part of.                           |
| game_profile             | embedded Game_Profile                     | Embedded document containing game profile details.                          |
| game_profile.game_points | number                                    | The number of game points the user has.                                     |
| game_profile.game_minutes_left | number                              | The number of game minutes left for the user.                               |
| is_feedback_available    | bool                                      | Indicates if feedback is available for the user.                            |
| recommended              | embedded Recommendations                  | Embedded document containing recommended lessons and exercises.             |
| recommended.lessons      | {name: string, id: id, Ref Lesson, extra_points }[] | List of recommended lessons with extra points.                              |
| recommended.exercises    | {name: string, id: id, Ref Exercise, extra_points}[] | List of recommended exercises with extra points.                            |
| new_exercise_submission  | {exercise: id, Ref Exercise, submission: Ref Exercise_Submission} | Details of the new exercise submission.                                     |
| learning_preferences     | string[]                                  | List of learning preferences for the user.                                  |
| class_progress_info      | embedded Class_Progress_Info              | Embedded document containing class progress information.                    |
| class_progress_info.lessons_completed | [id, Ref Lesson]             | List of completed lessons.                                                  |
| class_progress_info.exercises | embedded Exercise_Submission[]       | List of exercise submissions with details.                                  |
| class_progress_info.exercises.exercise | id, Ref Exercise            | Reference to the exercise.                                                  |
| class_progress_info.exercises.max_score | number                     | Maximum score achieved in the exercise.                                     |
| class_progress_info.exercises.coins_earned | number                  | Number of coins earned in the exercise.                                     |
| class_progress_info.exercises.best_score | number                    | Best score achieved in the exercise.                                        |
| class_progress_info.exercises.feedback | string                      | Feedback for the exercise.                                                  |
| class_progress_info.exercises.attempts | {attempt_number: number, score: number, answers: string}[] | List of attempts with details.                                              |
| class_progress_info.exercises.last_attempt_at | Date                 | Date of the last attempt.                                                   |
| class_progress_info.unit | {id: id, Ref Unit, name: string}          | Details of the unit.                                                        |
| class_progress_info.progress_percent | number                        | Progress percentage in the class.                                           |
| class_progress_info.class | id, Ref Classroom                        | Reference to the classroom.                                                 |


### Pseudo Schema

```

collection User {
	name string
	email string
	password string
	role: Enum("teacher", "student", "admin")
	profile_picture: string
	school: string
	classroom: [id, Ref classroom]
	game_profile: embedded Game_Profile{
		game_points: number
		game_minutes_left: number
	}
	is_feedback_available: bool
	recommended: embedded Recommendations {
		lessons: {name: string, id: id, Ref Lesson, extra_points }[]
		exercises: {name: string, id: id, Ref Exercise, extra_points}[]]
	}
	new_exercise_submission: {
		exercise: id, Ref Exercise
		submission: Ref Exercise_Submission
	}
	learning_preferences: string[],
	class_progress_info: embedded Class_Progress_Info{
		lessons_completed: [id, Ref Lesson]
		exercises: embedded Exercise_Submission{ 
			exercise: id, Ref Exercise
			max_score: number
			coins_earned: number
			best_score: number
			feedback: string
			attempts: {
				attempt_number: number
				score: number
				answers: string
			}[]
			last_attempt_at: Date
		}[] 
		unit: {
			id: id, Ref Unit
			name: string
		}
		progress_percent: number
		class: id, Ref Classroom
	}[]
}

```


## Collection: `Classroom`


| Field                    | Type                                      | Description                                                                 |
|--------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| name                     | string                                    | The name of the classroom.                                                  |
| students_enrolled        | {student: id, Ref User, is_new_exercise_submission: bool}[] | List of students enrolled in the classroom.                                 |
| teachers_joined          | {teacher: id, Ref User, name: string}[]   | List of teachers joined in the classroom.                                   |
| creator                  | id, Ref User                              | Reference to the user who created the classroom.                            |
| class_join_code          | number                                    | Code to join the classroom.                                                 |
| is_game_blocked          | bool                                      | Indicates if the game is blocked for the classroom.                         |
| game_restriction_period  | {start: Date, end: Date}                  | Period during which the game is restricted.                                 |
| is_recently_updated_announcement | bool                             | Indicates if there is a recently updated announcement.                      |
| announcement             | string                                    | The announcement for the classroom.                                         |
| today_unit               | {title: string, unit: id, Ref Unit}       | Details of today's unit.                                                    |
| chosen_units             | {name: string, description: string, difficulty: string, skills: string[], unit: id, Ref Unit}[] | List of chosen units for the classroom.                                     |


### Pesudo Schema

```
collection Classroom {
	name: string
	students_enrolled: {student: id, Ref User, is_new_exercise_submission: bool}[]
	teachers_joined: {teacher: id, Ref User, name: string}[]
	creator: id, Ref User
	class_join_code: number 
	is_game_blocked: bool
	game_restriction_period: {
		start: Date
		end: Date
	}
	is_recently_updated_announcement: bool
	announcement: string
	today_unit: {
		title: string
		unit: id, Ref Unit
	}
	chosen_units: {
		name: string
		description: string
		difficulity: string
		skills: string[]
		unit: id, Ref Unit
	}[]
}
```

## Collection: `Unit`

| Field                    | Type                                      | Description                                                                 |
|--------------------------|-------------------------------------------|-----------------------------------------------------------------------------|
| name                     | string                                    | The name of the unit.                                                       |
| description              | string                                    | The description of the unit.                                                |
| difficulty               | string                                    | The difficulty level of the unit.                                           |
| skills                   | string[]                                  | List of skills covered in the unit.                                         |
| related_units            | [id, Ref Unit]                            | References to related units.                                                |
| prerequisites            | [id, Ref Unit]                            | References to prerequisite units.                                           |
| lessons                  | embedded Lesson[]                         | Embedded documents containing lesson details.                               |
| lessons.title            | string                                    | The title of the lesson.                                                    |
| lessons.description      | string                                    | The description of the lesson.                                              |
| lessons.instruction      | string                                    | Instructions for the lesson.                                                |
| lessons.lesson_type      | Enum("flashcards", "text", "image", ...)  | The type of the lesson.                                                     |
| lessons.lesson_content   | [JSON Objects]                            | The content of the lesson.                                                  |
| lessons.variants         | [id, Ref Lesson]                          | References to variant lessons.                                              |
| exercises                | embedded Exercise[]                       | Embedded documents containing exercise details.                             |
| exercises.title          | string                                    | The title of the exercise.                                                  |
| exercises.description    | string                                    | The description of the exercise.                                            |
| exercises.instruction    | string                                    | Instructions for the exercise.                                              |
| exercises.exercise_type  | Enum("blanks", "drag_drop", "mcq", ...)   | The type of the exercise.                                                   |
| exercises.exercise_content | [JSON Objects]                          | The content of the exercise.                                                |
| exercises.is_instant_scored | bool                                    | Indicates if the exercise is instantly scored.                              |
| exercises.correct_answers | JSON Object                              | The correct answers for the exercise.                                       |
| exercises.variants       | [id, Ref Exercise]                        | References to variant exercises.                                            |

### Pseudo Schema
```
collection Unit{
	name: string
	description: string
	difficulity: string
	skills: string[]
	related_units: [id, Ref Unit]
	prerequisites: [id, Ref Unit]
	lessons: embedded Lesson{
		title: string
		description: string
		instruction: string
		lesson_type: Enum("flashcards", "text", "image", ...)
		lesson_content: [JSON Objects]
		varients: [id, Ref Lesson]
	}[]
	exercises: embedded Exercise{
		title: string
		description: string
		instruction: string
		exercise_type: Enum("blanks", "drag_drop", "mcq", ...)
		exercise_content: [JSON Objects]
		is_instant_scored: bool
		correct_answers: JSON Object
		varients: [id, Ref Exercise]
	}[]
}
```

## Collection: `Points_Log`

| Field       | Type                                      | Description                                                                 |
|-------------|-------------------------------------------|-----------------------------------------------------------------------------|
| user        | id, Ref User                              | Reference to the user associated with the points log.                       |
| classroom   | id, Ref Classroom                         | Reference to the classroom associated with the points log.                  |
| giver       | id, Ref User                              | Reference to the user who gave the points.                                  |
| is_add      | bool                                      | Indicates if points were added (true) or subtracted (false).                |
| amount      | number                                    | The amount of points added or subtracted.                                   |
| details     | string                                    | Details about the points transaction.                                       |
| type        | Enum("extra_points", "game_spending", "instant_exercise", "teacher_scored", ...) | The type of points transaction.                                             |
| created_at  | Date                                      | The date when the points log was created.                                   |
| updated_at  | Date                                      | The date when the points log was last updated.                              |

### Pseudo Schema
```
collection Points_Log{
	user: id, Ref User
	classroom: id, Ref Classroom
	giver: id, Ref User
	is_add: bool
	amount: number
	details: string
	type: Enum("extra_points", "game_spending", "instant_exercise", "teacher_scored", ...)
	created_at: Date
    updated_at: Date
}
```
