package com.shreya.visual_matcher.service;

import com.shreya.visual_matcher.dto.SearchResponse;
import com.shreya.visual_matcher.model.entity.Product;
import org.springframework.web.multipart.MultipartFile;
import com.shreya.visual_matcher.util.EmbeddingUtil;
import com.shreya.visual_matcher.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SearchService {

    private final ProductRepository productRepository;

    public SearchService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<SearchResponse> searchProducts(
            MultipartFile file,
            String imageUrl,
            double minScore
    ) {

        List<Product> products = productRepository.findAll();
        List<SearchResponse> results = new ArrayList<>();

        String queryInput = file != null
                ? file.getOriginalFilename()
                : imageUrl;

        double[] queryVector = EmbeddingUtil.generateEmbedding(queryInput);

        for (Product product : products) {

            double[] productVector = EmbeddingUtil.generateEmbedding(
                    product.getName() + product.getCategory()
            );

            double score = EmbeddingUtil.cosineSimilarity(queryVector, productVector);

            if (score >= minScore) {
                results.add(
                        new SearchResponse(
                                product.getId(),
                                product.getName(),
                                product.getCategory(),
                                product.getImageUrl(),
                                score
                        )
                );
            }
        }

        results.sort((a, b) ->
                Double.compare(b.getSimilarityScore(), a.getSimilarityScore())
        );

        return results;
    }

}
