import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrinityLyfeService } from '../trinity-lyfe.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  searchTerm;
  searchResultsArray = [];
  searchError

  constructor(private route: ActivatedRoute, private trinityLyfeService: TrinityLyfeService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.searchTerm = params['search_term'];
      this.trinityLyfeService.getAPIData("user?search_term="+this.searchTerm, true).subscribe((resp: any) => {
        let searchResults = resp.results.searchResults;
        for(let index in searchResults) {
          let searchResult = searchResults[index];
          let searchResultItem = {};
          searchResultItem["username"] = searchResult["username"];
          searchResultItem["name"] = searchResult["name"];
          this.searchResultsArray.push(searchResultItem);
        } 
      },
      (errorResp) => {
        this.searchError = "Something went wrong, please try again!"
      })
    });
  }

}
