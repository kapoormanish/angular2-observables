/// <reference path="../typings/tsd.d.ts" />

import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
// import 'rxjs/add/operator/flatMap'
// import 'rxjs/add/operator/empty'
import {Control, ControlGroup, FormBuilder} from "angular2/common";
import {subscribeToResult} from "rxjs/util/subscribeToResult";

@Component({
    selector: 'my-app',
    template: `
        <form [ngFormModel]="form">
            <input type="text" ngControl="search">    
        </form>
    `
})
export class AppComponent {
    form: ControlGroup;

    constructor(formBuilder: FormBuilder){
        this.form = formBuilder.group({
            search: []
        });
        var search = this.form.find('search');
        search.valueChanges
            .debounceTime(400)
            .map(x => (<string> x).replace(' ', '-'))
            .subscribe(x => console.log(x));

        var startDates = [];
        var startDate = new Date();
        for(var day = -2; day<=2; day++){
            var date = new Date(startDate.getFullYear(), startDate.getMonth(), (startDate.getDate()+day));
            startDates.push(date);
        }

        Observable.from(startDates)
            .map(date => {console.log("Getting deals for date: "+ date); return date;})
            .subscribe(x => console.log(x))

        console.log("Empty observable-----")
        var observable = Observable.empty();
        observable.subscribe(x => console.log(x));

        // console.log("observable interval----")
        // var interval = Observable.interval(1000);
        // interval.subscribe(x => console.log("Intervale: ",x))
        //
        // console.log("observable of interval using flatmap----")
        // Observable.interval(1000).map(x => {return Observable.of({'value': x});}).subscribe(x => console.log("From Mergemap Intervale: ",x))

        console.log("running observables in parallel----")
        var userStream = Observable.of({user: {id: 1, name: "Manish"}}).delay(2000);
        var tweetStream = Observable.of({tweets: [{id: 1, name: "wow, wat a great weather"}]}).delay(1500);
        Observable.forkJoin(userStream, tweetStream)
            .subscribe(result => console.log(result));
    }
}