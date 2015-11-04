define(['outil', 'aide'], function(Outil, Aide) {
    function OutilTableSelection(options){
        this.options = options || {};

        if (this.options.type === 'efface'){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'selection_effacer',
                titre: 'Effacer la sélection',
                infobulle: 'Effacer la sélection',
                icone: Aide.obtenirCheminRacine()+'images/toolbar/gui-pointer.gif'
            });
        } else if (this.options.type === 'inverse'){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'selection_inverse',
                allowDepress: false,
                infobulle: 'Inverser la selection',
                titre: 'Inverser la sélection',
                icone: Aide.obtenirCheminRacine()+'images/toolbar/gui-pointer.gif'
            });
        } else if (this.options.type === 'complet'){
            this.defautOptions = $.extend({},this.defautOptions, {
               id:'selection_tout',
               infobulle: 'Tout sélectionner',
               titre: 'Tout sélectionner',
               icone: Aide.obtenirCheminRacine()+'images/toolbar/gui-pointer.gif'
            });
        } else if (this.options.type === 'zoom'){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'zoom_selection',
                titre: 'Zoom sur la sélection',
                infobulle: 'Zoom sur la sélection',
                icone: Aide.obtenirCheminRacine()+'images/toolbar/moveto.png'
            });
         } else if (this.options.type === 'pan'){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'pan_selection',
                titre: 'Zoom sur la sélection',
                infobulle: 'Zoom sur la sélection',
                icone: Aide.obtenirCheminRacine()+'images/toolbar/icon_pan.png'
            });
        } else if (this.options.type === 'auto'){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'zoom_auto',
                xtype:'menucheckitem',
                titre: 'Zoom auto sur la sélection',
                infobulle: 'Zoom auto sur la sélection',

           });
        }  else if (this.options.type === 'contenupage' && this.options.panneauTable.options.paginer === true){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'contenupage',
                xtype:'menucheckitem',
                titre: 'Afficher le contenu de la page seulement',
                infobulle: 'Affiche seulement le contenu de la page active.',

           });
        }  else if (this.options.type === 'selectionSeulement'){
            this.defautOptions = $.extend({},this.defautOptions, {
                id: 'affiche_selection_seulement',
                xtype:'menucheckitem',
                titre: 'Afficher la sélection seulement',
                infobulle: 'Affiche seulement la sélection'
           });
        }
    };

    OutilTableSelection.prototype = new Outil();
    OutilTableSelection.prototype.constructor = OutilTableSelection;


    OutilTableSelection.prototype._init = function() {
        this.initEvent();
        Outil.prototype._init.call(this);
    };

    OutilTableSelection.prototype.executer =  function (lancementManuel) {

        lancementManuel = typeof lancementManuel === "undefined"?false:true;

        if (this.options.type === 'efface'){
            this.options.couche.deselectionnerTout();
        } else if (this.options.type === 'inverse'){
             this.options.couche.selectionnerInverse();
        } else if (this.options.type === 'complet'){
            this.options.couche.selectionnerTout();
        } else if (this.options.type === 'zoom'){
            this.options.couche.zoomerOccurences(this.options.couche.obtenirOccurencesSelectionnees());
        } else if (this.options.type === 'auto'){
            if(!lancementManuel){
                this.options.couche.zoomAuto = !this._bouton.checked;
            }
        }  else if (this.options.type === 'contenupage'){
            if(!lancementManuel){
                this.options.couche.afficheContenuPage = !this._bouton.checked;
            }
            if((!lancementManuel && !this._bouton.checked) || (lancementManuel && this._bouton.checked)){
                this.options.couche.cacherTout();
                this.options.couche.afficherOccurence(this.options.panneauTable.obtenirOccurences());

                //ne pas permettre l'option d'afficher seulement la sélection
                $.each(this.parent.obtenirOutils(), function(index,value){
                    if(value.options.type === 'selectionSeulement'){
                        value._bouton.setChecked(false);
                        value._bouton.disable();
                        value.options.couche.options.selectionSeulement = false;
                    }
                });
            }
            else{

                $.each(this.parent.obtenirOutils(), function(index,value){
                    if(value.options.type === 'selectionSeulement'){
                        value._bouton.enable();
                    }
                });

                this.options.couche.afficherTout();
            }
        } else if (this.options.type === 'selectionSeulement'){

            if(!lancementManuel){
                this.options.couche.options.selectionSeulement = !this._bouton.checked;
            }
            if((!lancementManuel && !this._bouton.checked) || (lancementManuel && this._bouton.checked)){
                 this.options.couche.declencher({ type: "occurenceClique", occurence:this.options.couche.obtenirOccurencesSelectionnees()});

                if(this.options.couche.options.selectionSeulement){
                    //ne pas permettre l'option d'afficher seulement le contenu de la page
                    $.each(this.parent.obtenirOutils(), function(index,value){
                        if(value.options.type === 'contenupage'){
                            value._bouton.disable();
                            value._bouton.setChecked(false);
                            value.options.couche.afficheContenuPage = false;
                        }
                    });
                }
            }
            else{
                $.each(this.parent.obtenirOutils(), function(index,value){
                    if(value.options.type === 'contenupage'){
                        value._bouton.enable();
                    }
                });
                //this.options.couche.afficherTout();
            }
        }
    };

    OutilTableSelection.prototype.initEvent =  function () {
        var that=this;
        if (this.options.type === 'inverse' || this.options.type === 'complet'){
            this.options.couche.ajouterDeclencheur('controleEditionActiver', function(){
                that.desactiver();
            });
            this.options.couche.ajouterDeclencheur('controleEditionDesactiver', function(){
                that.activer();
            });
        }
    };

     return OutilTableSelection;

});
