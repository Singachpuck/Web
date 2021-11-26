package service;

import model.ObjectParamsHolder;

import java.util.List;
import java.util.Map;

public interface ObjectService {

    List<ObjectParamsHolder> findAll();
    ObjectParamsHolder save(ObjectParamsHolder objectParamsHolder);
    void deleteById(int id);
}
