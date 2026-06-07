package com.creatorconnect.backend.config;

import com.creatorconnect.backend.model.Category;
import com.creatorconnect.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeCategories();
    }

    private void initializeCategories() {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = Arrays.asList(
                    "Fashion", "Beauty", "Tech", "Lifestyle", "Food", "Travel", "Fitness"
            );

            for (String categoryName : defaultCategories) {
                categoryRepository.save(new Category(categoryName));
            }
            System.out.println("Default categories initialized successfully!");
        }
    }
}
