package com.shreya.visual_matcher.util;

import java.util.Random;

public class EmbeddingUtil {

    public static double[] generateEmbedding(String input) {
        Random random = new Random(input.hashCode());
        double[] vector = new double[10];

        for (int i = 0; i < vector.length; i++) {
            vector[i] = random.nextDouble();
        }

        return vector;
    }

    public static double cosineSimilarity(double[] a, double[] b) {
        double dot = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += Math.pow(a[i], 2);
            normB += Math.pow(b[i], 2);
        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
