package com.shreya.visual_matcher.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class searchRequest {
    private MultipartFile file;
    private String imageUrl;
    private double minScore;

}
