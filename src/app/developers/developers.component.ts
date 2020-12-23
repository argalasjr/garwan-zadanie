import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import { from, timer } from 'rxjs';
import { RestApiService} from '../network/rest-api.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Sort} from '../util/sort'


@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  currentLocation = 'Bratislava'
  currentSort = 'public_repos'
  currentOrder = 'desc'
  currentType = ''
  developersList = [];
  sortUtil = null;
  loading = false;
  page = 0;
  constructor(
    private ngZone: NgZone,
    public restApi: RestApiService,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private router: Router,
    private cd: ChangeDetectorRef

    ) {
      this.sortUtil = new Sort();
  }

  ngOnInit(): void {
    const loggedInUser = this.route.snapshot.params;
    console.log(loggedInUser);
    this.fetchMore(this.currentLocation)
  
   
  }

  ngAfterViewInit(): void {

    this.updateList();
  }

  search(term: string): void {


    this.currentLocation = term;

   
  }

  triggerSearch(){
    this.page = 0;
    this.developersList.splice(0,this.developersList.length)
    this.fetchMore(this.currentLocation);
  }


 async fetchMore(location): Promise<void> {
   console.log(location)
    this.page = this.page + 1;
    this.restApi.getDevelopers(this.page,location).subscribe(async data => { 
      console.log(data)
      if(data){
      const newItems = [];
      for (let i = 0; i < data.items.length; i++) {

        // nenasiel som v dokumentacii lepsi sposob ako ziskat detaily kazdeho usera iba urobit pre kazdeho novy request

       this.restApi.getDeveloperDetail(data.items[i].login).subscribe(
          userDetail => {
            console.log(userDetail)
            if(userDetail){
            newItems.push({
              login:  userDetail.login,         
              avatar_url: userDetail.avatar_url,    
              followers: userDetail.followers,
              public_repos: userDetail.public_repos,
              created_at: userDetail.created_at
            });
      
          } 
        }
      
        )
 


      
      }

   
      this.loading = true;
      timer(1000).subscribe(() => {
        this.loading = false;
        this.developersList = [...this.developersList, ...newItems];
        this.developersList.sort(this.sortUtil.startSort(this.currentSort,this.currentOrder,this.currentType))
        this.cd.detectChanges();


      });
  
    
    } else {

        this.logout();
    }
      
    });
 
   
  }
  updateList(){
    this.scroller.elementScrolled().pipe(
      map(() => this.scroller.measureScrollOffset('bottom')),
      pairwise(),
      filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
      throttleTime(200)
    ).subscribe(() => {
      this.ngZone.run(() => {
     
          this.fetchMore(this.currentLocation);
      });
    }
    );
  }

  sortByRepos(){

    this.currentSort = 'public_repos'
    this.currentOrder = 'desc'
    this.currentType = ''
    this.developersList = [...this.developersList.sort(this.sortUtil.startSort(this.currentSort,this.currentOrder,this.currentType))]
    this.cd.detectChanges()
   
  }
 sortByFollowers(){
   this.currentSort = 'followers'
   this.currentOrder = 'desc'
   this.currentType = ''
   this.developersList = [...this.developersList.sort(this.sortUtil.startSort(this.currentSort,this.currentOrder,this.currentType))]
  this.cd.detectChanges();
 }
  sortByRegistrationDate(){
    this.currentSort = 'created_at'
    this.currentOrder = 'desc'
    this.currentType = 'date'
    this.developersList = [...this.developersList.sort(this.sortUtil.startSort(this.currentSort,this.currentOrder,this.currentType))]
    this.cd.detectChanges();
  }



  logout(){
    this.afAuth.signOut().then((success)=>{
      this.ngZone.run(() => {
        if(this.restApi.authGithub){
          this.restApi.removeToken();
        }
        this.router.navigate(['/login']);
        console.log('succes');
       });
 
    });
  }
}
