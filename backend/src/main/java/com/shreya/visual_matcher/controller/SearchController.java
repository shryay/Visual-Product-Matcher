package com.shreya.visual_matcher.controller;

import com.shreya.visual_matcher.dto.SearchResponse;
import com.shreya.visual_matcher.service.SearchService;
import org.springframework.web.bind.annotation.*;
import com.shreya.visual_matcher.dto.searchRequest;
import java.util.List;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public List<SearchResponse> search(@Valid @RequestBody searchRequest request) {

        if (request.getFile() == null && request.getImageUrl() == null) {
            throw new RuntimeException("Either file or imageUrl must be provided");
        }

        return searchService.searchProducts(request.getFile(), request.getImageUrl(), request.getMinScore());
    }

}
