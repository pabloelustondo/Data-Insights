function(key, values) {
                        var reducedObject = {
                                              userid: key,
                                              total_time: 0,
                                              count:0,
                                              avg_time:0
                                            };
                        values.forEach( function(value) {
                                              reducedObject.total_time += value.total_time;
                                              reducedObject.count += value.count;
                                        }
                                      );
                        return reducedObject;
                     };