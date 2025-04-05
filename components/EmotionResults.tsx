import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';

interface EmotionResultsProps {
  analysisResult: {
    dominant: string;
    recommendedMusicMood: string;
    confidenceScore: number;
    emotions: {
      [key: string]: string;
    };
    recommendedPlaylists: Array<{ id: string; name: string }>;
  };
}

const EmotionResults: React.FC<EmotionResultsProps> = ({ analysisResult }) => {
  const formatEmotionLevel = (level: string): string => {
    return level.replace('_', ' ').toLowerCase();
  };

  const getEmotionBarWidth = (level: string): DimensionValue => {
    const levels: Record<string, number> = {
      VERY_LIKELY: 100,
      LIKELY: 75,
      POSSIBLE: 50,
      UNLIKELY: 25,
      VERY_UNLIKELY: 10,
    };
    return `${levels[level] || 0}%`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emotion Analysis</Text>

      <View style={styles.details}>
        <Text style={styles.text}>
          <Text style={styles.label}>Dominant emotion: </Text>
          <Text style={styles.bold}>{analysisResult.dominant}</Text>
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Recommended mood: </Text>
          <Text style={styles.bold}>{analysisResult.recommendedMusicMood}</Text>
        </Text>
        <Text style={styles.text}>
          <Text style={styles.label}>Confidence: </Text>
          <Text style={styles.bold}>{(analysisResult.confidenceScore * 100).toFixed(2)}%</Text>
        </Text>
      </View>

      <View style={styles.barContainer}>
        {Object.entries(analysisResult.emotions).map(([emotion, level]) => (
          <View key={emotion} style={styles.emotionWrapper}>
            <View style={styles.labelRow}>
              <Text style={styles.emotionText}>{emotion}:</Text>
              <Text style={styles.levelText}>{formatEmotionLevel(level)}</Text>
            </View>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: getEmotionBarWidth(level),
                    backgroundColor:
                      emotion === analysisResult.dominant ? '#6366f1' : '#6b7280',
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  details: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 4,
    color: '#1f2937',
  },
  label: {
    fontWeight: '500',
    color: '#374151',
  },
  bold: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  barContainer: {
    gap: 10,
  },
  emotionWrapper: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  emotionText: {
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#1f2937',
  },
  levelText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
});

export default EmotionResults;
