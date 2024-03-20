package main

import (
	"fmt"

	"github.com/r--w/pocketbase"
)

func main() {
	client := pocketbase.NewClient("http://localhost:5555")
	// response, err := client.List("events", pocketbase.ParamsList{
	// 	Page: 1, Size: 10, Sort: "-created",
	// })
	// if err != nil {
	// 	fmt.Println("Error: ", err)
	// }
	response, err := client.Create("events", map[string]any{
		"title":       "Face from GO",
		"description": "Face from GO",
		"frameId":     1,
		"frameImage":  "",
		"videoUrl":    "",
		"camera":      "tap7chob96ngm14",
		"node":        "pjshfx3c4fha5jo",
		"session":     "rasah5x88ev0nc2",
	})
	if err != nil {
		fmt.Println("Error: ", err)
	}
	fmt.Println(response)

	// _, err := app.Dao().DB().NewQuery(query).Execute()
	// if err != nil {
	// 	fmt.Println(err)
	// }
}
