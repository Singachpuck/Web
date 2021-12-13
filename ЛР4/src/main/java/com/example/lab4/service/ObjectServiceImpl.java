package com.example.lab4.service;

import com.example.lab4.dao.ObjectDao;
import com.example.lab4.model.ObjectParamsHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ObjectServiceImpl implements ObjectService{

    private ObjectDao objectDao;

    @Autowired
    public void setObjectDao(ObjectDao objectDao) {
        this.objectDao = objectDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ObjectParamsHolder> findAll() {
        List<ObjectParamsHolder> objects = new ArrayList<>();
        objectDao.findAll().forEach(objects::add);

        return objects;
    }

    @Override
    public ObjectParamsHolder save(ObjectParamsHolder objectParamsHolder) {
        return objectDao.save(objectParamsHolder);
    }

    @Override
    public void deleteById(int id) {
        objectDao.deleteById(id);
    }
}
