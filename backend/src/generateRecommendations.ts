import { IUnit, Unit } from "./models/unit.model.ts"
import { ILesson } from "./models/unit.model.ts"
import { IExercise } from "./models/unit.model.ts"
import { User } from "./models/user.model.ts"

export async function generateRecommendations(userId: string): Promise<void> {
  // 1. Retrieve User Exercise Performance Data
  const user = await User.findById(userId).lean();
  if (!user) return;

  const classProgressInfos = user.class_progress_info;

  // 2. Retrieve Tags Associated with Each Exercise
  const exerciseAttempts = classProgressInfos.flatMap((progressInfo) =>
    progressInfo.exercises?.map((exerciseSubmission) => ({
      exerciseId: exerciseSubmission.exercise,
      attempts: exerciseSubmission.attempts,
    }))
  );

  // Map to store scores per tag
  const tagScoresMap = new Map<string, number[]>();
  console.log("Passed 1")

  for (const attempt of exerciseAttempts) {
    const unit = await Unit.findOne(
      { "exercises._id": attempt?.exerciseId },
      { "exercises.$": 1 }
    ).lean<IUnit>();
    const exercise = unit?.exercises[0];
    if (exercise && exercise.tags) {
      const tags = exercise.tags;
    const scores = attempt?.attempts.map((a) => {if(a.score) return a.score / exercise.max_score});
      for (const tag of tags) {
        if (!tagScoresMap.has(tag)) {
          tagScoresMap.set(tag, []);
        }
        if (scores) {
          tagScoresMap.get(tag)!.push(...scores.filter((score): score is number => score !== undefined));
        }
      }
    }
  }
  console.log("Passed 2")

  // 3. Calculate Metrics for Each Tag
  interface TagPerformance {
    averageScore: number;
    scoreVariance: number;
    scores: number[];
  }

  const tagPerformanceMap = new Map<string, TagPerformance>();

  for (const [tag, scores] of tagScoresMap.entries()) {
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const scoreVariance =
      scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length;

    tagPerformanceMap.set(tag, {
      averageScore,
      scoreVariance,
      scores,
    });
  }
  console.log("Passed 3")

  // 4. Identify Knowledge Gaps
  const KNOWLEDGE_GAP_SCORE_THRESHOLD = 50; // Adjust threshold as needed
  const KNOWLEDGE_GAP_VARIANCE_THRESHOLD = 10;

  const knowledgeGapTags: string[] = [];

  for (const [tag, performance] of tagPerformanceMap.entries()) {
    if (
      performance.averageScore < KNOWLEDGE_GAP_SCORE_THRESHOLD &&
      performance.scoreVariance < KNOWLEDGE_GAP_VARIANCE_THRESHOLD
    ) {
      knowledgeGapTags.push(tag);
    }
  }
  console.log("Passed 4")

  // 5. Check Lesson Completion for Content Accessibility
  const completedLessonIds = classProgressInfos.flatMap((progressInfo) =>
    progressInfo.lessons_completed?.map((lesson) => lesson)
  );

  // Units where lessons are completed
  const accessibleUnits = await Unit.find({
    "lessons._id": { $in: completedLessonIds },
  }).lean();

  console.log("Passed 5")

  const accessibleUnitIds = accessibleUnits.map((unit) => unit._id);

  // 6. Generate Recommendations
  // a. Recommend Lessons
  const recommendedLessons = await Unit.aggregate([
    { $unwind: "$lessons" },
    { $match: { "lessons.tags": { $in: knowledgeGapTags } } },
    {
      $project: {
        _id: "$lessons._id",
        title: "$lessons.title",
        unitId: "$_id",
        tags: "$lessons.tags",
      },
    },
  ]) as ILesson[];

  console.log("Passed 6")

  // b. Recommend Exercises
  const recommendedExercises = await Unit.aggregate([
    { $match: { _id: { $in: accessibleUnitIds } } },
    { $unwind: "$exercises" },
    { $match: { "exercises.tags": { $in: knowledgeGapTags } } },
    {
      $project: {
        _id: "$exercises._id",
        title: "$exercises.title",
        unitId: "$_id",
        tags: "$exercises.tags",
        variants: "$exercises.variants",
      },
    },
  ]) as IExercise[];

  console.log("Passed 7")

  // 7. Apply Learning Preferences
  const userPreferences = user.learning_preferences || [];

  // Sort exercises to bring variants to the top
  const sortedExercises = recommendedExercises.sort((a, b) => {
    const aHasVariant = a.varients?.some((variant: any) => userPreferences.includes(variant.type)) ? 1 : 0;
    const bHasVariant = b.varients?.some((variant: any) => userPreferences.includes(variant.type)) ? 1 : 0;
    return bHasVariant - aHasVariant;
  });

  console.log("Passed 8")
  console.log(sortedExercises)

  const filteredExercises = sortedExercises;


  // 8. Prioritize and Finalize Recommendations
  recommendedLessons.sort((a, b) => {
    const aTagPerformance = a.tags ? tagPerformanceMap.get(a.tags[0]) : undefined;
    const bTagPerformance = b.tags ? tagPerformanceMap.get(b.tags[0]) : undefined;
    return (aTagPerformance?.averageScore || 0) - (bTagPerformance?.averageScore || 0);
  });

  recommendedExercises.sort((a, b) => {
    const aTagPerformance = a.tags ? tagPerformanceMap.get(a.tags[0]) : undefined;
    const bTagPerformance = b.tags ? tagPerformanceMap.get(b.tags[0]) : undefined;
    return (aTagPerformance?.averageScore || 0) - (bTagPerformance?.averageScore || 0);
  });

  console.log("Passed 9")

  // 9. Compile the Recommendation List
  const MAX_RECOMMENDATIONS = 5;

  const finalRecommendedLessons = recommendedLessons.slice(0, MAX_RECOMMENDATIONS);
  const finalRecommendedExercises = filteredExercises.slice(0, MAX_RECOMMENDATIONS);

  console.log("Passed 10")
  // 10. Update User's Recommendations
  user.recommended = {
    lessons: finalRecommendedLessons.map((lesson, index) => ({
      name: lesson.title,
      id: lesson._id,
      extra_points: (MAX_RECOMMENDATIONS - index) * 10,
    })),
    exercises: finalRecommendedExercises.map((exercise, index) => ({
      name: exercise.title,
      id: exercise._id,
      extra_points: (MAX_RECOMMENDATIONS - index) * 10,
    })),
  };

  await User.findByIdAndUpdate(userId, { recommended: user.recommended });
}