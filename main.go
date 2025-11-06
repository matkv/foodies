package main

import (
	"html/template"
	"log"
	"net/http"
)

var tmpl = template.Must(template.ParseFiles("templates/index.html"))

func handler(w http.ResponseWriter, r *http.Request) {
	data := map[string]interface{}{
		"Sites": []string{
			"https://ankerpunkt.at/mittagstisch",
			"https://hotel-gollner.at/kueche/#Wochenmenue",
			"https://www.jakobspizzeriaundgrill.at/",
			"https://scontent-vie1-1.xx.fbcdn.net/v/t39.30808-6/572499111_1392640719536700_3418588426153503851_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LN_YA-jJAdwQ7kNvwGDK0Jn&_nc_oc=AdlCdRWSz2nbZ5ujO8eeCmXQaCy7TPGx0opuEan_HhuuaS9v75hddeF887_rBuUyXgk&_nc_zt=23&_nc_ht=scontent-vie1-1.xx&_nc_gid=glTuOloSp8Wu8N4xfil09Q&oh=00_AfhXaF9zNvdf9Dcse8YCUJzajCj8VmKELhMoyMk1O3T1ig&oe=69129BB3",
		},
	}
	if err := tmpl.Execute(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", handler)

	log.Println("Server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
