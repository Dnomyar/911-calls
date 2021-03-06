# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.

### \#1 - Compter le nombre d'appels autour de Lansdale dans un rayon de 500 mètres

```
{
  "query" : {
    "bool" : {
      "filter" : {
        "geo_distance": {
          "location": {
            "lat": 40.241493,
            "lon": -75.283783
          },
          "distance": "500m"
        }
      }
    }
  }
}

```


### \#2 - Compter le nombre d'appels par catégorie
```
{
  "size" : 0,
  "aggs": {
    "fire": {
      "filter" : {
        "match": {
          "title_cat": "Fire*"
        } 
      }
    },
    "tarffic": {
      "filter" : {
        "match": {
          "title_cat": "Traffic"
        } 
      }
    },
    "ems": {
      "filter" : {
        "match": {
          "title_cat": "EMS"
        } 
      }
    },
    "total_count": {
      "global" : {}
    }
  }
}
```


### \#3 - Trouver les 3 mois ayant comptabilisés le plus d'appels
```
{
    "size": 0,
    "aggs" : {
        "max_calls" : {
            "date_histogram" : {
                "interval" : "month",
                "order" : { "_count" : "desc" }
                "field" : "timeStamp",
            }
        }
    }
}
```


### \#4 - Trouver le top 3 des villes avec le plus d'appels pour overdose
```
{
  "size": 0,
  "query": {
      "match" : {
          "title_descr" : "OVERDOSE"
      }
  },
  "aggs" : {
        "group_cities": {
          "terms" : {
            "field" : "twp.keyword"
          }
        }
  }
}
```

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```
