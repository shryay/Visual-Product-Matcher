package com.shreya.visual_matcher.dto;

public class SearchResponse {

    private Long id;
    private String name;
    private String category;
    private String imageUrl;
    private double similarityScore;

    public SearchResponse(Long id, String name, String category, String imageUrl, double similarityScore) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.imageUrl = imageUrl;
        this.similarityScore = similarityScore;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getImageUrl() { return imageUrl; }
    public double getSimilarityScore() { return similarityScore; }
}
