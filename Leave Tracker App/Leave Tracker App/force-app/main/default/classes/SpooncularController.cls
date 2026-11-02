public with sharing class SpooncularController {

    private static final String API_KEY = '3611f36786f24db6a9e5ff9acd3fa338';
    private static final String BASE_URL = 'https://api.spoonacular.com/';

    @auraEnabled(cacheable=true)
    public static String getRandomRecipe() {
        //System.debug(makeCallout('recipes/random', ''));
        return makeCallout('recipes/random', '&number=1&include-tags=vegetarian');
    }

    public static String getRecipe(String recipeId) {
        return makeCallout('recipes/' + recipeId + '/information', '');
        //System.debug(makeCallout('recipes/' + recipeId + '/information', ''));

    }

    public static String getRecipeByIngredient(String ingredient) {
        
        return makeCallout('recipes/findByIngredients', '&ingredients=' + ingredient);
        //System.debug(makeCallout('recipes/findByIngredients', '&ingredients=' + ingredient));
    }

    private static String makeCallout(String endpoint, String params) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(BASE_URL + endpoint + '?apiKey=' + API_KEY + params);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        return response.getStatusCode() == 200 ? response.getBody() : null;
    }

    
    @AuraEnabled(cacheable=true) 
    public static List<Contact> fetchContacts() {
        return [SELECT Id, Name, Phone, Email FROM Contact LIMIT 10];
    }

}


public class RecipeWrapper {
    public Integer id;
    public String title;
    public String image;
    public String summary;

}