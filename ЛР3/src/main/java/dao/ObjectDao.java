package dao;

import model.ObjectParamsHolder;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

public interface ObjectDao extends CrudRepository<ObjectParamsHolder, Integer> {
}
