import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService} from '../network/rest-api.service';
import { Location } from '@angular/common';
import { Developer } from '../model/developer';
@Component({
  selector: 'app-developer-detail',
  templateUrl: './developer-detail.component.html',
  styleUrls: ['./developer-detail.component.css']
})
export class DeveloperDetailComponent implements OnInit {

  public title;
  public issuesList = []
  constructor(
    private route: ActivatedRoute,
    public restApi: RestApiService,
    private location: Location
  ) { }

  developer: Developer;

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    if(id === 'profile'){
      this.title = 'User Profile'
      this.restApi.getProfile()
      .subscribe(dev => {
        if(dev){
        this.developer = dev; 
        console.log(dev)
        this.restApi.getUserIssues(dev.login)
        .subscribe(data => {
          console.log(data.items)
          this.issuesList = data.items
        });
      }
      });


     
    } else {
      this.title= 'Developer Detail'
      console.log(id)
      this.restApi.getDeveloperDetail(id)
        .subscribe(dev => {this.developer = dev; console.log(dev)});
        

    }
  }

  goBack(): void {
    this.location.back();
  }

  goToLink(url: string){
    window.open(url, "_blank");
}


}
