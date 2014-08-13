## ontrack client side js

All models extend BaseModel, by doing so they inherit BaseModel's methods:
1. **$save()** POSTS or PUTS (if the model `$$isNew`) to API; if `true` is passed model
               will be saved in Local Storage after successful HTTP request
2. **$fetch()** GETS from API
3. **$destroy()** DELETE to API
4. **$saveLocal()** Puts model in Local Storage; a model may have a $getSpecialLocalStorageKey
                    function defined, if you wish to use a key scheme different than the default;
                    only `!$$isNew` models can use this function
5. **$load()** Gets data from Local Storage; if your model doesn't have special storage key you must
               pass an `id` to `$load()`
            
