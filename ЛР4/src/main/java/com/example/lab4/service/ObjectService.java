package com.example.lab4.service;

import com.example.lab4.model.ObjectParamsHolder;

import java.util.List;

public interface ObjectService {

    List<ObjectParamsHolder> findAll();
    ObjectParamsHolder save(ObjectParamsHolder objectParamsHolder);
    void deleteById(int id);
}
