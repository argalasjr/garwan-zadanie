import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, pairwise, filter, throttleTime } from 'rxjs/operators';
import { timer } from 'rxjs';
import { RestApiService} from '../network/rest-api.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { Sort} from '../util/sort'
@Component({
  selector: 'app-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  currentSort = 'public_repos'
  currentOrder = 'desc'
  currentType = ''
  developersList = [];
  sortUtil = null;
  loading = false;
  fromId :Number = 1
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
    this.fetchMore();
  }

  ngAfterViewInit(): void {

    this.updateList();
  }

  fetchMore(): void {
    this.restApi.getDevelopers(this.fromId).subscribe(data => { 
      console.log(data)
    
      const newItems = [];
      for (let i = 0; i < data.length; i++) {

        // nenasiel som v dokumentacii lepsi sposob ako ziskat detaily kazdeho usera iba urobit pre kazdeho novy request
        this.restApi.getDeveloperDetail(data[i].login).subscribe(
          userDetail => {
            newItems.push({
              login: data[i].login,         
              avatar_url: data[i].avatar_url,    
              followers: userDetail.followers,
              public_repos: userDetail.public_repos,
              created_at: userDetail.created_at
            });

          }
        )
      
      }
      if(data[data.length -1]){
      this.fromId = data[data.length -1].id;
      console.log(this.fromId)
      }
   
      this.loading = true;
      timer(1000).subscribe(() => {
        this.loading = false;
        this.developersList = [...this.developersList, ...newItems];
        this.developersList.sort(this.sortUtil.startSort(this.currentSort,this.currentOrder,this.currentType))
        this.cd.detectChanges();


      });
  
    
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
        this.fetchMore();
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
          this.restApi.authGithub = false;
        }
        this.router.navigate(['/login']);
        console.log('succes');
       });
 
    });
  }
}
