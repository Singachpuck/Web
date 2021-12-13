package com.example.lab4.dao;

import com.example.lab4.model.ObjectParamsHolder;
import org.springframework.data.repository.CrudRepository;

public interface ObjectDao extends CrudRepository<ObjectParamsHolder, Integer> {
}
